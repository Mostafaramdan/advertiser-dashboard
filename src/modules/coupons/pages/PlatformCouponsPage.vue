a
<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { COUPONS_TYPES } from '@/constants/coupons'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { PlatformCoupon } from '../interfaces/PlatformCoupon'
import PlatformCouponDetailsModal from '../modals/PlatformCouponDetailsModal.vue'
import PlatformCouponFormModal from '../modals/PlatformCouponFormModal.vue'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission, hasAtLeaseOnePermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'coupons'

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  type: COUPONS_TYPES.platform,
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
  sortItems,
} = UseCrudHelpers<PlatformCoupon>(couponsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'كود الكوبون',
    key: 'code',
  },
  {
    title: 'تاريخ البداية/تاريخ النهاية',
    key: 'started_at',
  },
  {
    title: 'نسبة الخصم',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'مرات الاستخدام',
    key: 'uses',
    align: 'center',
  },
  {
    title: 'نسبة تحمل المسوق',
    key: 'marketer_ratio',
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
  create: hasPermission('create_platform_coupon'),
  edit: hasPermission('update_platform_coupon'),
  delete: hasPermission('delete_platform_coupon'),
  changeStatus: hasPermission('change_status_platform_coupon'),
  sort: hasPermission('sort_platform_coupon'),
  viewHistory: hasAtLeaseOnePermission([
    'view_coupon_subscriber_logs',
    'view_coupon_transactions_history',
  ]),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: showCrateModal,
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
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <PlatformCouponFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @edit-item="onEditItem"
    @create-item="onCreateItem"
  />
  <PlatformCouponDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="كوبونات المنصة" class="page-card">
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
          <div class="d-flex align-center" style="min-inline-size: 150px">
            <VAvatar size="38" variant="tonal" class="me-3" cover>
              <VImg v-if="item.image" :src="item.image.path" cover />
              <span v-else>!</span>
            </VAvatar>
            <span>
              {{ item.code }}
            </span>
          </div>
        </template>

        <template #item.started_at="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 80px">
            {{ formatDate(item.started_at) }}
            <span class="text-sm text-disabled d-block"> {{ formatDate(item.ended_at) }}</span>
          </div>
        </template>
        <template #item.discount="{ item }">
          <div class="text-no-wrap">{{ item.discount }}%</div>
        </template>

        <template #item.marketer_ratio="{ item }">
          <div style="min-inline-size: 80px">{{ item.marketer_ratio }}%</div>
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

            <IconBtn :disabled="!permissions.edit" @click="showEditModal(item)">
              <VIcon icon="tabler-edit" />
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
                  <VListItem
                    :disabled="!permissions.viewHistory"
                    :to="{
                      name: 'platform-coupon-details-page',
                      params: { id: item.id },
                      query: { tab: 'subscribers-history' },
                    }"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-history" />
                    </template>

                    <VListItemTitle>السجل</VListItemTitle>
                  </VListItem>

                  <VListItem
                    :disabled="
                      !selectedItems.length || selectedItems.includes(item.id) || !permissions.sort
                    "
                    @click="sortItems(item.id)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-transfer-in" />
                    </template>
                    <VListItemTitle>نقل</VListItemTitle>
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
