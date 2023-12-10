<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { OFFER_STATUSES } from '@/constants/offers'
import { useAuthStore } from '@/stores/AuthStore'
import { useOffersStore } from '@/stores/OffersStore'
import { useToast } from 'vue-toastification'
import { offersService } from '../services/OffersService'
import OfferAcceptModal from './OfferAcceptModal.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const route = useRoute()
const { hasPermission } = useAuthStore()
const offersStore = useOffersStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'offers'
const offerId = +route.params.id
const confirmModal = ref<any>()
const showNotificationModal = ref<boolean>(false)
const showAcceptOfferModal = ref<boolean>(false)
const activeUser = ref(null)
const isLoading = reactive({
  data: false,
  delete: false,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  delete: hasPermission('delete_offer'),
  edit: hasPermission('update_offer'),
  changeStatus: hasPermission('change_status_offer'),
  sendNotification: hasPermission('notify_users'),
  acceptOffer: hasPermission('accept_offer'),
  rejectOffer: hasPermission('reject_offer'),
  cancelOffer: hasPermission('cancel_offer'),
  changeOfferStatus: hasPermission('change_publish_status_offer'),
  changeQuantityStatus: hasPermission('change_quantity_status_offer'),
}))

const data = computed(() => offersStore.offerDetails)
const offerImage = computed(() => data.value.image?.path || data.value.user?.image_path)
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
  offersStore.setOfferDetails(null)
  isLoading.data = true
  offersService
    .getSingleItem(offerId)
    .then((res) => {
      offersStore.setOfferDetails(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

function deleteItem() {
  isLoading.delete = true
  offersService
    .deleteItem(offerId)
    .then((res) => {
      toast.success(res.data.message)
      data.value.is_deleted = true
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

function onAcceptOffer() {
  offersStore.updateOfferStatus('accepted')
}

function rejectOffer() {
  isLoading.data = true
  offersService
    .rejectOffer(offerId)
    .then((res) => {
      toast.success(res.data.message)
      offersStore.updateOfferStatus('rejected')
    })
    .finally(() => {
      isLoading.data = false
    })
}

function cancelOffer() {
  isLoading.data = true
  offersService
    .cancelOffer(offerId)
    .then((res) => {
      toast.success(res.data.message)
      offersStore.updateOfferStatus('cancelled')
    })
    .finally(() => {
      isLoading.data = false
    })
}
// #endregion
</script>

<template>
  <div>
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <OfferAcceptModal
      v-model:showModal="showAcceptOfferModal"
      :offer-id="data.id"
      v-if="data && showAcceptOfferModal"
      @accept-offer="onAcceptOffer"
    />
    <ConfirmModal ref="confirmModal" />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض تفاصيل العرض </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="basic-data">
            <VSkeletonLoader v-if="isLoading.data" type="list-item-avatar-two-line" />
            <div v-else-if="data" class="profile-card d-flex align-md-center">
              <div class="me-3">
                <VAvatar variant="outlined" size="80" cover rounded="0">
                  <VImg v-if="offerImage" :src="offerImage" cover />
                  <span v-else>!</span>
                </VAvatar>
                <VChip
                  class="px-2 mt-1 text-center d-block"
                  color="error"
                  label
                  v-if="data.is_deleted"
                  size="x-small"
                >
                  محذوف
                </VChip>
              </div>
              <div class="profile-card__content flex-grow-1">
                <h3 class="mb-1 d-flex flex-wrap align-center justify-between gap-x-3">
                  <span class="me-auto">{{ data.name }}</span>
                  <ToggleActivationSwitch
                    :id="data.id"
                    v-model="data.is_active"
                    :model="MODEL_NAME"
                    :disabled="!permissions.changeStatus || data.is_deleted"
                    :label="data.is_active ? 'تنشيط' : 'إيقاف'"
                  />
                </h3>
                <div class="d-flex flex-wrap gap-x-4 gap-y-2">
                  <span class="d-flex align-center"
                    ><strong class="me-3">رقم العرض</strong>
                    {{ data.id }}
                  </span>
                  <span class="d-flex align-center"
                    ><strong class="me-3">اسم المستخدم</strong>
                    {{ data.user.username }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">تاريخ الانشاء</strong>
                    {{ formatDateTime(data.created_at) }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">حالة العرض</strong>
                    {{ OFFER_STATUSES.get(data.status)?.label }}
                  </span>
                </div>
                <div class="d-flex flex-wrap gap-3 w-100 mt-2">
                  <VBtn
                    variant="outlined"
                    :disabled="!permissions.edit"
                    :to="{ name: 'offer-edit-page', params: { id: data.id } }"
                  >
                    تعديل
                    <VIcon end icon="tabler-edit" />
                  </VBtn>
                  <VBtn variant="outlined" :max-width="38" :min-width="40">
                    <VIcon icon="tabler-dots-vertical" />
                    <VMenu activator="parent" max-height="265">
                      <VList>
                        <VListItem
                          :disabled="isLoading.delete || !permissions.delete"
                          @click="showConfirmModal"
                          v-if="!data.is_deleted"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-trash" />
                          </template>
                          <VListItemTitle>حذف</VListItemTitle>
                        </VListItem>
                        <VListItem
                          v-if="['pending', 'accepted'].includes(data.status)"
                          :disabled="!permissions.cancelOffer"
                          @click="cancelOffer"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-circle-x" />
                          </template>

                          <VListItemTitle>إلغاء العرض</VListItemTitle>
                        </VListItem>
                        <template v-if="data.status === 'pending'">
                          <VListItem :disabled="!permissions.rejectOffer" @click="rejectOffer">
                            <template #prepend>
                              <VIcon icon="tabler-ban" />
                            </template>

                            <VListItemTitle>رفض العرض</VListItemTitle>
                          </VListItem>
                          <VListItem
                            :disabled="!permissions.acceptOffer"
                            @click="showAcceptOfferModal = true"
                          >
                            <template #prepend>
                              <VIcon icon="tabler-circle-check" />
                            </template>

                            <VListItemTitle>الموافقة على العرض</VListItemTitle>
                          </VListItem>
                        </template>
                        <VListItem
                          :disabled="!permissions.sendNotification"
                          @click="openNotificationModal(data.user)"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-mail" />
                          </template>
                          <VListItemTitle>ارسال اشعار للمستخدم</VListItemTitle>
                        </VListItem>
                        <VListItem v-if="permissions.changeOfferStatus" @click.stop>
                          <VListItemTitle class="ps-2">
                            <ToggleActivationSwitch
                              :id="data.id"
                              v-model="data.publish_status"
                              :model="MODEL_NAME"
                              column="publish_status"
                              label="حالة العرض"
                            />
                          </VListItemTitle>
                        </VListItem>
                        <VListItem v-if="permissions.changeQuantityStatus" @click.stop>
                          <VListItemTitle class="ps-2">
                            <ToggleActivationSwitch
                              :id="data.id"
                              v-model="data.quantity_status"
                              :model="MODEL_NAME"
                              column="quantity_status"
                              label="حالة كمية العرض"
                            />
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>
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
