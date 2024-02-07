<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { OFFER_STATUSES } from '@/constants/offers'
import { useAuthStore } from '@/stores/AuthStore'
import { useOffersStore } from '@/stores/OffersStore'
import { useToast } from 'vue-toastification'
import OfferEditPermissionsModal from '../modals/OfferEditPermissionsModal.vue'
import OfferEditStatusModal from '../modals/OfferEditStatusModal.vue'
import OfferProductsAcceptanceModal from '../modals/OfferProductsAcceptanceModal.vue'
import OfferProductsActivationModal from '../modals/OfferProductsActivationModal.vue'
import OfferProductsQtyAvailabilityModal from '../modals/OfferProductsQtyAvailabilityModal.vue'
import { offersService } from '../services/OffersService'
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
const showProductsAcceptanceModal = ref<boolean>(false)
const showProductsQtyAvailabilityModal = ref<boolean>(false)
const showProductsActivationsModal = ref<boolean>(false)
const showOfferEditStatusModal = ref<boolean>(false)
const showOfferEditPermissionsModal = ref<boolean>(false)
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
  acceptProducts: hasPermission('accept_product'),
  editProductsQty: hasPermission('toggle_product_availability_quantity'),
  changeProductsStatus: hasPermission('change_status_product'),
  editStatus: hasPermission('update_offer_status'),
  viewEditPermissions: hasPermission('view_offer_permissions'),
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

function onEditOfferStatus(status: string) {
  showOfferEditStatusModal.value = false
  data.value.status = status
}

// #endregion
</script>

<template>
  <div>
    <template v-if="data">
      <ConfirmModal ref="confirmModal" />
      <NotificationModal
        v-if="showNotificationModal"
        v-model:showModal="showNotificationModal"
        :user="data.user"
      />
      <OfferProductsAcceptanceModal
        v-if="showProductsAcceptanceModal"
        v-model:showModal="showProductsAcceptanceModal"
        :offer-id="data.id"
        @save="getPageData"
      />
      <OfferProductsQtyAvailabilityModal
        v-if="showProductsQtyAvailabilityModal"
        v-model:showModal="showProductsQtyAvailabilityModal"
        :offer-id="data.id"
      />
      <OfferProductsActivationModal
        v-if="showProductsActivationsModal"
        v-model:showModal="showProductsActivationsModal"
        :offer-id="data.id"
      />
      <OfferEditStatusModal
        :offer="data"
        v-if="showOfferEditStatusModal"
        v-model:showModal="showOfferEditStatusModal"
        @edit-item="onEditOfferStatus"
      />
      <OfferEditPermissionsModal
        :offer-id="data.id"
        v-if="showOfferEditPermissionsModal"
        v-model:showModal="showOfferEditPermissionsModal"
      />
    </template>
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
                    {{ data.user.account_name }}
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
                    :disabled="
                      !permissions.edit ||
                      !['pending', 'processing', 'accepted'].includes(data.status)
                    "
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
                          :disabled="
                            isLoading.delete ||
                            !permissions.delete ||
                            !['pending', 'processing'].includes(data.status)
                          "
                          @click="showConfirmModal"
                          v-if="!data.is_deleted"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-trash" />
                          </template>
                          <VListItemTitle>حذف</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="!permissions.editStatus"
                          @click="showOfferEditStatusModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-edit" />
                          </template>

                          <VListItemTitle>تعديل الحالة</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="!permissions.viewEditPermissions"
                          @click="showOfferEditPermissionsModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-circle-key" />
                          </template>

                          <VListItemTitle>صلاحيات التعديل</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="
                            !permissions.acceptProducts ||
                            !['pending', 'processing', 'accepted'].includes(data.status)
                          "
                          @click="showProductsAcceptanceModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-shopping-bag-edit" />
                          </template>

                          <VListItemTitle>الموافقة على المنتجات</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="
                            !permissions.editProductsQty || !['accepted'].includes(data.status)
                          "
                          @click="showProductsQtyAvailabilityModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-box" />
                          </template>

                          <VListItemTitle>تعديل حالة كمية المنتجات</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="
                            !permissions.changeProductsStatus || !['accepted'].includes(data.status)
                          "
                          @click="showProductsActivationsModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-eye-edit" />
                          </template>

                          <VListItemTitle>تعديل حالة عرض المنتجات</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="!permissions.sendNotification"
                          @click="showNotificationModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-mail" />
                          </template>
                          <VListItemTitle>ارسال اشعار للمستخدم</VListItemTitle>
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
