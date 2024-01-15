<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { OFFER_STATUSES, OFFER_TYPES } from '@/constants/offers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { Offer, User } from '../interfaces/Offer'
import OfferEditStatusModal from '../modals/OfferEditStatusModal.vue'
import OfferProductsAcceptanceModal from '../modals/OfferProductsAcceptanceModal.vue'
import OfferProductsActivationModal from '../modals/OfferProductsActivationModal.vue'
import OfferProductsQtyAvailabilityModal from '../modals/OfferProductsQtyAvailabilityModal.vue'
import { offersService } from '../services/OffersService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('../components/OffersFilter.vue'))
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'offers'
const showNotificationModal = ref<boolean>(false)
const showProductsAcceptanceModal = ref<boolean>(false)
const showProductsQtyAvailabilityModal = ref<boolean>(false)
const showProductsActivationsModal = ref<boolean>(false)
const showOfferEditStatusModal = ref<boolean>(false)
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const activeUser = ref<User | null>(null)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  packages: [],
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  activeItem,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
} = UseCrudHelpers<Offer>(offersService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'الحالة/رقم العرض',
    key: 'image_path',
  },
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'تاريخ البداية/تاريخ النهاية',
    key: 'from_date',
  },
  {
    title: 'نوع العرض/عدد المنتجات',
    key: 'offer_type',
  },
  {
    title: 'المنتجات المقبولة/المنتجات المرفوضة',
    key: 'accepted_products_count',
  },
  {
    title: 'الحالة',
    key: 'is_active',
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
  sendNotification: hasPermission('notify_users'),
  create: hasPermission('create_offer'),
  edit: hasPermission('update_offer'),
  delete: hasPermission('delete_offer'),
  changeStatus: hasPermission('change_status_offer'),
  acceptProducts: hasPermission('accept_product'),
  editProductsQty: hasPermission('toggle_product_availability_quantity'),
  changeProductsStatus: hasPermission('change_status_product'),
  editStatus: hasPermission('update_offer_status'),
  viewEditPermissions: hasPermission('view_offer_permissions'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: goToCreatePage,
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
function goToCreatePage() {
  router.push({ name: 'offer-create-page' })
}

function openNotificationModal(user: User) {
  activeUser.value = user
  showNotificationModal.value = true
}

function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}

function deleteItem(item: Offer) {
  IsLoadingData.value = true
  offersService
    .deleteItem(item.id)
    .then((res) => {
      item.is_deleted = true
      toast.success(res.data.message)
    })
    .catch(() => {
      item.is_deleted = false
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

async function showConfirmDeleteItem(item: Offer): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteItem(item)
}

function rowProps({ item }: { item: Offer }) {
  return {
    class: item.is_deleted && 'bg-background',
  }
}

function openProductsAcceptanceModal(item: Offer) {
  activeItem.value = item
  showProductsAcceptanceModal.value = true
}

function openProductsQtyAvailabilityModal(item: Offer) {
  activeItem.value = item
  showProductsQtyAvailabilityModal.value = true
}

function openProductsActivationModal(item: Offer) {
  activeItem.value = item
  showProductsActivationsModal.value = true
}

function openOfferEditStatusModal(item: Offer) {
  activeItem.value = item
  showOfferEditStatusModal.value = true
}
// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <OfferProductsAcceptanceModal
      v-if="activeItem && showProductsAcceptanceModal"
      v-model:showModal="showProductsAcceptanceModal"
      :offer-id="activeItem.id"
    />
    <OfferProductsQtyAvailabilityModal
      v-if="activeItem && showProductsQtyAvailabilityModal"
      v-model:showModal="showProductsQtyAvailabilityModal"
      :offer-id="activeItem.id"
    />
    <OfferProductsActivationModal
      v-if="activeItem && showProductsActivationsModal"
      v-model:showModal="showProductsActivationsModal"
      :offer-id="activeItem.id"
    />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <OfferEditStatusModal
      :offer="activeItem"
      v-if="activeItem && showOfferEditStatusModal"
      v-model:showModal="showOfferEditStatusModal"
      @edit-item="getPageData"
    />
    <VCard title="العروض" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :show-multi-delete="permissions.delete"
          :show-multi-activate="permissions.changeStatus"
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
          :item-selectable="(item) => !item.is_deleted"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
          :row-props="rowProps"
        >
          <template #item.image_path="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.image_path" :src="item.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <VChip
                  class="px-1 mt-1"
                  :color="item.is_deleted ? 'error' : 'success'"
                  label
                  size="x-small"
                >
                  {{ item.is_deleted ? 'محذوف' : 'متواجد' }}
                </VChip>
              </div>
              <div style="min-inline-size: 140px">
                {{ OFFER_STATUSES.get(item.status)?.label }}
                <span class="text-sm text-disabled d-block"> {{ item.id ?? '-' }}</span>
              </div>
            </div>
          </template>
          <template #item.user="{ item }">
            <router-link
              :to="{
                name:
                  item.user.role === 'advertiser'
                    ? 'advertisers-profile-page'
                    : 'user-profile-page',
                params: { id: item.user.id },
                query: { tab: 'details' },
              }"
              class="d-flex align-center"
            >
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <span class="d-flex align-center justify-center text-sm mt-1">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                  {{ item.user.rate ?? '-' }}
                </span>
              </div>
              <div style="min-inline-size: 140px">
                <span>{{ item.user.account_name }}</span>
                <span class="text-sm text-disabled d-block"> {{ item.user.area_name ?? '-' }}</span>
              </div>
            </router-link>
          </template>
          <template #item.from_date="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ formatDate(item.from_date) }}
              <span class="text-sm text-disabled d-block"> {{ formatDate(item.to_date) }}</span>
            </div>
          </template>
          <template #item.offer_type="{ item }">
            <div style="min-inline-size: 100px">
              <span>{{ OFFER_TYPES.get(item.offer_type)?.label }}</span>
              <span class="text-sm text-disabled d-block"> {{ item.products_count }}</span>
            </div>
          </template>
          <template #item.accepted_products_count="{ item }">
            <div style="min-inline-size: 110px">
              {{ item.accepted_products_count }}
              <span class="text-sm text-disabled d-block"> {{ item.rejected_products_count }}</span>
            </div>
          </template>
          <template #item.is_active="{ item }">
            <ToggleActivationSwitch
              :id="item.id"
              v-model="item.is_active"
              :model="MODEL_NAME"
              :disabled="!permissions.changeStatus || item.is_deleted"
            />
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :to="{
                  name: 'offer-details-page',
                  params: { id: item.id },
                  query: { tab: 'details' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent" max-height="265">
                  <VList>
                    <VListItem
                      :disabled="!permissions.create"
                      :to="{ name: 'offer-create-page', query: { offerId: item.id } }"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-copy" />
                      </template>

                      <VListItemTitle>تكرار</VListItemTitle>
                    </VListItem>
                    <VListItem
                      v-if="!item.is_deleted"
                      :disabled="
                        !permissions.delete || !['pending', 'processing'].includes(item.status)
                      "
                      @click="showConfirmDeleteItem(item)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>

                      <VListItemTitle>حذف</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="
                        !permissions.edit ||
                        !['pending', 'processing', 'accepted'].includes(item.status)
                      "
                      :to="{ name: 'offer-edit-page', params: { id: item.id } }"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-edit" />
                      </template>

                      <VListItemTitle>تعديل</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.editStatus"
                      @click="openOfferEditStatusModal(item)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-edit" />
                      </template>

                      <VListItemTitle>تعديل الحالة</VListItemTitle>
                    </VListItem>
                    <VListItem :disabled="!permissions.viewEditPermissions">
                      <template #prepend>
                        <VIcon icon="tabler-circle-key" />
                      </template>

                      <VListItemTitle>صلاحيات التعديل</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="
                        !permissions.acceptProducts ||
                        !['pending', 'processing', 'accepted'].includes(item.status)
                      "
                      @click="openProductsAcceptanceModal(item)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-shopping-bag-edit" />
                      </template>

                      <VListItemTitle>الموافقة على المنتجات</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="
                        !permissions.editProductsQty || !['accepted'].includes(item.status)
                      "
                      @click="openProductsQtyAvailabilityModal(item)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-box" />
                      </template>

                      <VListItemTitle>تعديل حالة كمية المنتجات</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="
                        !permissions.changeProductsStatus || !['accepted'].includes(item.status)
                      "
                      @click="openProductsActivationModal(item)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-eye-edit" />
                      </template>

                      <VListItemTitle>تعديل حالة عرض المنتجات</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.user)"
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
:deep(.v-data-table .v-table__wrapper) {
  > table td,
  > table th {
    padding-inline: 8px;
  }
}

:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
