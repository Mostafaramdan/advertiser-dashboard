<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { API_SEND_ATTACHMENT_NOTIFICATION } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'
import type { DocumentItem } from '../interfaces/Documents'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: DocumentItem[]
  }>(),
  {},
)
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDate } = UseGeneralHelpers()
const { hasPermission } = useAuthStore()
const HistoryModal = defineAsyncComponent(
  () => import('@/components/user-profile/licenses-documents-tab/HistoryModal.vue'),
)
const showNotificationModal = ref<boolean>(false)
const showHistoryModal = ref<boolean>(false)
const notificationApiUrl = ref<string>('')
const activeItem = ref<DocumentItem | null>(null)
const tableHeadings = [
  'اسم الوثيقة',
  'نوع الوثيقة',
  'اسم صاحب الوثيقة',
  'نوع صاحب الوثيقة',
  'تاريخ إنشاء الوثيقة',
  'تاريخ انتهاء الوثيقة',
  'أخر تحديث للوثيقة',
  'إرسال تنبيه',
  'سجل عمليات الوثيقة',
]
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  sendNotification: hasPermission('send_notification_attachments'),
  viewHistory: hasPermission('show_attachments_logs'),
}))

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function openNotificationModal(item: DocumentItem) {
  activeItem.value = item
  notificationApiUrl.value = API_SEND_ATTACHMENT_NOTIFICATION(item.id)
  showNotificationModal.value = true
}

function openHistoryModal(item: DocumentItem) {
  activeItem.value = item
  showHistoryModal.value = true
}

// #endregion
</script>

<template>
  <div>
    <HistoryModal
      :activeId="activeItem.id"
      v-if="activeItem && showHistoryModal"
      v-model:showModal="showHistoryModal"
      active-tab="logs"
    />
    <NotificationModal
      v-if="activeItem?.user && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeItem.user"
      :url="notificationApiUrl"
    />
    <VExpansionPanels :model-value="0" class="mt-5">
      <VExpansionPanel>
        <VExpansionPanelTitle>الوثائق والمستندات المنتهية</VExpansionPanelTitle>
        <VExpansionPanelText>
          <v-table class="simple-table" density="compact" v-if="stats.length">
            <thead>
              <tr>
                <th v-for="item in tableHeadings" :key="item">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in stats" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <span class="max-width-180">{{ item.user?.username || '-' }}</span>
                </td>
                <td>
                  <span v-if="item.user">{{ USERS_ROLES[item.user.role] }}</span>
                  <span v-else>-</span>
                </td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td>{{ formatDate(item.ended_at) }}</td>
                <td>{{ formatDate(item.last_update) }}</td>
                <td>
                  <VBtn
                    variant="outlined"
                    size="33"
                    @click="openNotificationModal(item)"
                    :disabled="!permissions.sendNotification || !item.user"
                  >
                    <VIcon icon="tabler-mail" size="20" />
                  </VBtn>
                </td>
                <td>
                  <VBtn
                    variant="outlined"
                    size="33"
                    @click="openHistoryModal(item)"
                    :disabled="!permissions.viewHistory"
                  >
                    <VIcon icon="tabler-history" size="20" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <div v-else class="text-h6">
            {{ t('general.no_data') }}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
