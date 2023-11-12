<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { LicenseDocument, UserBasicData } from '@/interfaces/User'
import { API_SEND_ATTACHMENT_NOTIFICATION, usersService } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface LicensesDocumentsTabProps {
  user: UserBasicData | null
}
const props = withDefaults(defineProps<LicensesDocumentsTabProps>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { hasPermission } = useAuthStore()
const { formatDateTime, formatDate } = UseGeneralHelpers()
const HistoryModal = defineAsyncComponent(() => import('./HistoryModal.vue'))
const NoteModal = defineAsyncComponent(() => import('./NoteModal.vue'))
const MODEL_NAME = 'user_attachments'
const advertiserId: number = +route.params.id
const isLoading = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const showNoteModal = ref<boolean>(false)
const showHistoryModal = ref<boolean>(false)
const defaultNotificationMsg = ref<string>('')
const notificationApiUrl = ref<string>('')
const tableData = ref<LicenseDocument[]>([])
const activeItemId = ref<number | null>(null)
const headers: any = [
  {
    title: 'اسم الوثيقة',
    key: 'name',
  },
  {
    title: 'رقم الوثيقة',
    key: 'number',
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'ended_at',
  },
  {
    title: 'المدة المتبقية',
    key: 'remaining_days',
    align: 'center',
  },
  {
    title: 'تاريخ التحديث',
    key: 'updated_at',
  },
  {
    title: 'تاريخ اخر تواصل',
    key: 'last_notified_at',
  },
  {
    title: 'صورة المرفق',
    key: 'file_path',
    align: 'center',
  },
  {
    title: 'الموافقة',
    key: 'is_active',
    align: 'center',
  },
  {
    title: 'ارسال تنبيه',
    key: 'notification',
    align: 'center',
  },
  {
    title: 'اضافة ملاحظة',
    key: 'note',
    align: 'center',
  },
  {
    title: 'السجل',
    key: 'history',
    align: 'center',
  },
]

//#endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  sendNotification: hasPermission('send_notification_attachments'),
  sendNote: hasPermission('send_note_attachments'),
  viewHistory: hasPermission('show_attachments_logs'),
  confirmLicenseDocument: hasPermission('confirm_attachments'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.value = true
  usersService
    .getLicensesDocuments(advertiserId)
    .then((res) => {
      tableData.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function openNotificationModal(item: LicenseDocument) {
  notificationApiUrl.value = API_SEND_ATTACHMENT_NOTIFICATION(item.id)
  defaultNotificationMsg.value = `عزيزي ${props.user?.username} يرجى العلم بأنه وثيقة ${item.name} قاربت على الإنتهاء برجاء تحديثها ورفع البيانات الجديدة بأسرع وقت ممكن`
  showNotificationModal.value = true
}

function openNoteModal(id: number) {
  activeItemId.value = id
  showNoteModal.value = true
}

function openHistoryModal(id: number) {
  activeItemId.value = id
  showHistoryModal.value = true
}
// #endregion
</script>

<template>
  <div class="licenses-documents-tab">
    <HistoryModal
      :activeId="activeItemId"
      v-if="activeItemId && showHistoryModal"
      v-model:showModal="showHistoryModal"
    />
    <NoteModal
      :activeId="activeItemId"
      v-if="activeItemId && showNoteModal"
      v-model:showModal="showNoteModal"
    />
    <NotificationModal
      v-if="user && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="user"
      :default-message="defaultNotificationMsg"
      :url="notificationApiUrl"
      @notification:sent="getPageData"
    />
    <VDataTableServer
      v-loading="isLoading"
      :headers="headers"
      :items="tableData"
      :items-length="tableData.length"
      class="app-table"
      :no-data-text="isLoading ? t('general.loading') : t('general.no_data')"
    >
      <template #item.name="{ item }">
        <span class="text-no-wrap">
          {{ item.name }}
        </span>
      </template>
      <template #item.ended_at="{ item }">
        <span class="text-no-wrap">
          {{ formatDate(item.ended_at) }}
        </span>
      </template>
      <template #item.remaining_days="{ item }">
        <span class="text-no-wrap" v-if="item.remaining_days !== null">
          <span v-if="item.remaining_days > 0"> {{ item.remaining_days }} يوم </span>
          <span class="text-error" v-else>منتهي</span>
        </span>
        <span v-else>-</span>
      </template>
      <template #item.updated_at="{ item }">
        <span class="text-no-wrap">
          {{ formatDateTime(item.updated_at) }}
        </span>
      </template>
      <template #item.last_notified_at="{ item }">
        <span class="text-no-wrap">
          {{ formatDateTime(item.last_notified_at) }}
        </span>
      </template>
      <template #item.file_path="{ item }">
        <div class="text-no-wrap">
          <a v-if="item.file_path" :href="item.file_path" target="_blank">تحميل المرفق</a>
          <span v-else>لا يوجد مرفق</span>
        </div>
      </template>
      <template #item.is_active="{ item }">
        <ToggleActivationSwitch
          :id="item.id"
          v-model="item.is_active"
          :model="MODEL_NAME"
          :disabled="!permissions.confirmLicenseDocument"
        />
      </template>
      <template #item.notification="{ item }">
        <VBtn
          variant="outlined"
          size="35"
          @click="openNotificationModal(item)"
          :disabled="!permissions.sendNotification"
        >
          <VIcon icon="tabler-mail" size="22" />
        </VBtn>
      </template>
      <template #item.note="{ item }">
        <VBtn
          variant="outlined"
          size="35"
          @click="openNoteModal(item.id)"
          :disabled="!permissions.sendNote"
        >
          <VIcon icon="tabler-message-2-plus" size="22" />
        </VBtn>
      </template>
      <template #item.history="{ item }">
        <VBtn
          variant="outlined"
          size="35"
          @click="openHistoryModal(item.id)"
          :disabled="!permissions.viewHistory"
        >
          <VIcon icon="tabler-history" size="22" />
        </VBtn>
      </template>

      <template #bottom> </template>
    </VDataTableServer>
  </div>
</template>

<style lang="scss" scoped>
.licenses-documents-tab {
  min-block-size: 47vh;

  :deep(.v-table) {
    td,
    th {
      padding-inline: 10px;
    }
  }

  :deep(.v-data-table-header__content) {
    white-space: nowrap;
  }
}
</style>
