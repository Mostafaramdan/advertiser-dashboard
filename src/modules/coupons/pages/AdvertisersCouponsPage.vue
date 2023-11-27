<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { COUPONS_TYPES } from '@/constants/coupons'
import { formatUrl } from '@/helpers/index'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useCouponsStore } from '@/stores/CouponsStore'
import type { AdvertiserCoupon } from '../interfaces/AdvertiserCoupon'
import AdvertisersCouponDetailsModal from '../modals/AdvertisersCouponDetailsModal.vue'
import AdvertisersCouponFormModal from '../modals/AdvertisersCouponFormModal.vue'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('../components/AdvertisersCouponsFilter.vue'),
)
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const couponsStore = useCouponsStore()
const MODEL_NAME = 'coupons'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  type: COUPONS_TYPES.advertiser,
})

const {
  selectedItems,
  tableData,
  metaData,
  showFormModal,
  showDetailsModal,
  FormAction,
  activeItem,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showCrateModal,
  showEditModal,
  showViewModal,
  onEditItem,
  onCreateItem,
  showConfirmDeleteItem,
} = UseCrudHelpers<AdvertiserCoupon>(couponsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'كود الكوبون/حالة الكوبون',
    key: 'code',
  },
  {
    title: 'اسم المعلن',
    key: 'advertiser',
  },
  {
    title: 'تاريخ البداية/تاريخ النهاية',
    key: 'started_at',
  },
  {
    title: 'المتجر/القسم',
    key: 'store',
  },
  {
    title: 'نسبة الخصم/مرات الاستخدام',
    key: 'discount',
    align: 'center',
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
  create: hasPermission('create_advertiser_coupon'),
  edit: hasPermission('update_advertiser_coupon'),
  delete: hasPermission('delete_advertiser_coupon'),
  changeStatus: hasPermission('change_status_advertiser_coupon'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: showCrateModal,
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
couponsStore.$reset()
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

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <AdvertisersCouponFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @edit-item="onEditItem"
    @create-item="onCreateItem"
  />
  <AdvertisersCouponDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <Component
    :is="FilterComponent"
    v-if="loadFilter"
    v-model:showFilter="showFilter"
    @apply-filter="onApplyFilter"
    :init-filters="params"
  />
  <VCard title="كوبونات المعلنين" class="page-card">
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
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.code="{ item }">
          <a
            :href="formatUrl(item.link)"
            target="_blank"
            class="d-flex align-center"
            style="min-inline-size: 150px"
          >
            <VAvatar size="38" variant="tonal" class="me-3" cover>
              <VImg v-if="item.store?.image" :src="item.store.image" cover />
              <span v-else>!</span>
            </VAvatar>
            <div class="overflow-hidden">
              {{ item.code }}
              <span class="text-sm text-disabled d-block"> {{ item.status_text }}</span>
            </div>
          </a>
        </template>

        <template #item.advertiser="{ item }">
          <span style="inline-size: 205px">
            {{ item.advertiser.account_name }}
          </span>
        </template>

        <template #item.started_at="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 80px">
            {{ formatDate(item.started_at) }}
            <span class="text-sm text-disabled d-block"> {{ formatDate(item.ended_at) }}</span>
          </div>
        </template>
        <template #item.discount="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 80px">
            {{ item.discount }}%
            <span class="text-sm text-disabled d-block">{{ item.uses }}</span>
          </div>
        </template>

        <template #item.status_text="{ item }">
          <div style="min-inline-size: 80px">{{ item.status_text }}</div>
        </template>

        <template #item.store="{ item }">
          <div style="min-inline-size: 100px">
            {{ item.store.name }}
            <span class="text-sm text-disabled d-block">{{ item.category.label }}</span>
          </div>
        </template>

        <template #item.is_active="{ item }">
          <ToggleActivationSwitch
            :id="item.id"
            v-model="item.is_active"
            :model="MODEL_NAME"
            :disabled="!permissions.changeStatus"
          />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>

                  <VListItem v-if="permissions.edit" @click="showEditModal(item)">
                    <template #prepend>
                      <VIcon icon="tabler-edit" />
                    </template>
                    <VListItemTitle>تعديل</VListItemTitle>
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
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 280px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
