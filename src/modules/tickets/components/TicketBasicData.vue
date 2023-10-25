<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { TICKETS_STATUSES, USERS_TYPES } from '@/constants/tickets'
import { sharedService } from '@/services/SharedService'
import { useAuthStore } from '@/stores/AuthStore'
import { useTicketsStore } from '@/stores/TicketsStore'
import { useToast } from 'vue-toastification'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const ticketsStore = useTicketsStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'tickets'
const ticketId = +route.params.id
const confirmModal = ref<any>()
const isLoading = reactive({
  data: false,
  delete: false,
  favorite: false,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  delete: hasPermission('delete_ticket'),
}))

const data = computed(() => ticketsStore.ticketBasicData)
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
  ticketsStore.setTicketBasicData(null)
  isLoading.data = true
  supportTicketsService
    .getSingleItem(ticketId)
    .then((res) => {
      ticketsStore.setTicketBasicData(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function deleteItem() {
  isLoading.delete = true
  supportTicketsService
    .deleteItem(data.value.id)
    .then((res) => {
      toast.success(res.data.message)
      router.push({ name: 'support-tickets-page' })
    })
    .finally(() => {
      isLoading.delete = false
    })
}

async function showConfirmModal(): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (!confirm) return

  deleteItem()
}

function toggleFavorite() {
  isLoading.favorite = true
  ticketsStore.toggleFavorite()
  const payload: any = {
    id: data.value.id,
    model: MODEL_NAME,
    column: 'is_starred',
  }
  sharedService
    .toggleActivation(payload)
    .then((res) => {
      toast.success(res.data.message)
      ticketsStore.updateTicketDate()
    })
    .catch(() => {
      ticketsStore.toggleFavorite()
    })
    .finally(() => {
      isLoading.favorite = false
    })
}
// #endregion
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض تفاصيل التذكرة </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="basic-data">
            <VSkeletonLoader v-if="isLoading.data" type="list-item-avatar-two-line" />
            <div v-else-if="data" class="profile-card d-flex flex-column flex-sm-row gap-3">
              <VAvatar variant="outlined" size="80" cover rounded="0">
                <VImg v-if="data.user.image_path" :src="data.user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
              <div class="profile-card__content flex-grow-1">
                <div class="d-flex flex-wrap gap-x-4 gap-y-1">
                  <span class="d-flex align-center flex-wrap"
                    ><strong class="me-3">مقدم التذكرة</strong>
                    {{ data.user.account_name }}
                  </span>
                  <span class="w-100"></span>
                  <span class="d-flex align-center"
                    ><strong class="me-3">رقم التذكرة</strong>
                    {{ data.id }}
                  </span>
                  <span class="d-flex align-center"
                    ><strong class="me-3">نوع المستخدم</strong>
                    {{ USERS_TYPES[data.user.role] }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">تاريخ الانشاء</strong>
                    {{ formatDateTime(data.created_at) }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">حالة التذكرة</strong>
                    {{ TICKETS_STATUSES.get(data.status)?.label }}
                  </span>
                  <div class="d-flex flex-wrap gap-3 w-100 mt-2">
                    <VBtn
                      variant="outlined"
                      color="error"
                      class="me-3"
                      @click="showConfirmModal"
                      :loading="isLoading.delete"
                      :disabled="isLoading.delete || !permissions.delete"
                    >
                      حذف التذكرة<VIcon end icon="tabler-trash" />
                    </VBtn>
                    <VBtn
                      variant="outlined"
                      class="me-3"
                      @click="toggleFavorite"
                      :disabled="isLoading.favorite"
                    >
                      اضافة للمفضلة
                      <VIcon
                        end
                        icon="tabler-star-filled"
                        :color="data.is_starred ? '#ffcc00' : 'dark'"
                      />
                    </VBtn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  font-size: 14px;
  word-break: break-word;
}
</style>
