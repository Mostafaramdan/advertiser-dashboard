<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { useAuthStore } from '@/stores/AuthStore'

import type { SubscribersHistoryItem } from '../interfaces/PlatformCoupon'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { hasPermission } = useAuthStore()
const couponId = +route.params.id

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const { tableData, metaData, IsLoadingData } = UseCrudHelpers<SubscribersHistoryItem>(
  null,
  null,
  '',
)

const headers: any = [
  {
    title: 'اسم الحساب/اسم المعلن',
    key: 'advertiser',
  },
  {
    title: 'مرات الاستخدام',
    key: 'uses_count',
    align: 'center',
  },
  {
    title: 'مجموع قيمة الطلبات',
    key: 'orders_total',
    align: 'center',
  },
  {
    title: 'مجموع قيمة الخصومات',
    key: 'discount_total',
    align: 'center',
  },
  {
    title: 'الدفع داخل المنصة',
    key: 'payment_total_in',
    align: 'center',
  },
  {
    title: 'الدفع خارج المنصة',
    key: 'payment_total_out',
    align: 'center',
  },
  {
    title: 'حالة الكوبون',
    key: 'status',
  },
]

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
function getPageData(): void {
  IsLoadingData.value = true
  couponsService
    .getSubscribersHistory({ id: couponId, params })
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

/**
 * @description reload page data
 * @return  {void}
 */
function reloadPageData(): void {
  params.page = 1
  getPageData()
}

/**
 * @description update search keyword and reload page data
 * @param  {string} value
 * @return  {void}
 */
function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

/**
 * @description update items per page and reload page data
 * @param  {number} value
 * @return  {void}
 */
function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

/**
 * @description reload page data and reset selected items
 */
function onReloadData(): void {
  reloadPageData()
}

// #endregion
</script>

<template>
  <section>
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="onReloadData"
      />
      <VDataTableServer
        v-loading="IsLoadingData"
        :headers="headers"
        :items="tableData"
        :items-length="metaData?.total || 0"
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.advertiser="{ item }">
          <div style="max-inline-size: 250px; min-inline-size: 150px">
            {{ item.advertiser.account_name }}
            <span class="text-sm text-disabled d-block"> {{ item.advertiser.username }}</span>
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip color="dark">
            {{ item.status }}
          </VChip>
        </template>

        <template #bottom>
          <PagePagination
            v-model:page="params.page"
            :meta-data="metaData"
            :get-page-data="getPageData"
          />
        </template>
      </VDataTableServer>
    </div>
  </section>
</template>

<style lang="scss" scoped>
:deep(.app-table th) {
  white-space: nowrap;
}
</style>
