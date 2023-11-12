<script setup lang="ts">
import NotificationCreateModal from '@/components/notifications/NotificationCreateModal.vue'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { NotificationListItem } from '@/interfaces/Notifications'
import type { pageAction } from '@/interfaces/Shared'
import { notificationsService } from '@/services/NotificationsService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('@/components/notifications/NotificationsFilter.vue'),
)
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'notifications'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showConfirmDeleteItem,
} = UseCrudHelpers<NotificationListItem>(notificationsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'نص رسالة التنبيه / الإشعار',
    key: 'body',
  },
  {
    title: 'مستقبل الإشعار/النوع',
    key: 'receiver',
  },
  {
    title: 'تاريخ الارسال/القسم',
    key: 'created_at',
  },
  {
    title: 'النوع/الحالة',
    key: 'notification_type',
  },
  {
    title: 'العمليات',
    key: 'actions',
    align: 'center',
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  create: hasPermission('create_notification'),
  delete: hasPermission('delete_notification'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: openNotificationsModal,
    },
    {
      icon: 'tabler-filter',
      show: true,
      handler: handleShowFilter,
    },
  ]
})

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
function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}

function openNotificationsModal() {
  showNotificationModal.value = true
}

// #endregion
</script>

<template>
  <section>
    <NotificationCreateModal
      v-model:showModal="showNotificationModal"
      v-if="showNotificationModal"
      @notification:sent="onReloadData"
    />
    <ConfirmModal ref="confirmModal" />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <VCard title="الاشعارات" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :show-multi-delete="permissions.delete"
          :model="MODEL_NAME"
          :selected-items="selectedItems"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-model="selectedItems"
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          show-select
          :items-length="metaData?.total || 0"
          item-value="id"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.body="{ item }">
            <div class="bg-background pa-2 my-2 rounded text-center" style="inline-size: 280px">
              {{ item.body }}
            </div>
          </template>
          <template #item.receiver="{ item }">
            <div style="inline-size: 205px" v-if="item.receiver">
              {{ item.receiver.username }}
              <span class="text-sm text-disabled d-block">{{ item.receiver.role }}</span>
            </div>
            <span v-else>-</span>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.created_at) }}
              <span class="text-sm text-disabled d-block">{{ item.notification_category }}</span>
            </div>
          </template>
          <template #item.notification_type="{ item }">
            <span class="d-block mb-1">{{ item.notification_type }}</span>
            <VChip :color="item.is_seen ? 'success' : 'dark'">
              {{ item.is_seen ? 'تم المشاهدة' : 'لم تتم المشاهدة' }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>

          <template #bottom>
            <PagePagination
              v-model:page="params.page"
              :meta-data="metaData"
              :get-page-data="getPageData"
            />
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  font-size: 14px;
  word-break: break-word;
}
</style>
