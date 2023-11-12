<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'

import type { OperationsHistoryItem } from '../interfaces/PlatformCoupon'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const couponId = +route.params.id

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const { tableData, metaData, IsLoadingData } = UseCrudHelpers<OperationsHistoryItem>(null, null, '')

const headers: any = [
  {
    title: 'اسم المستفيد/نوع المستفيد',
    key: 'user',
  },
  {
    title: 'اسم المزود/نوع المزود',
    key: 'advertiser',
  },
  {
    title: 'تاريخ العملية',
    key: 'created_at',
  },
  {
    title: 'رقم العملية',
    key: 'id',
    align: 'center',
  },
  {
    title: 'رقم الطلب',
    key: 'ads_request_id',
    align: 'center',
  },
  {
    title: 'قيمة الطلب',
    key: 'total',
    align: 'center',
  },
  {
    title: 'إجمالي الخصم',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'تحمل المنصة',
    key: 'platform_cost',
    align: 'center',
  },
  {
    title: 'تحمل المزود',
    key: 'provider_cost',
    align: 'center',
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
    .getOperationsHistory({ id: couponId, params })
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
        <template #item.user="{ item }">
          <div style="max-inline-size: 250px; min-inline-size: 150px">
            {{ item.user.username }}
            <span class="text-sm text-disabled d-block"> {{ item.user.role }}</span>
          </div>
        </template>
        <template #item.advertiser="{ item }">
          <div style="max-inline-size: 250px; min-inline-size: 150px">
            {{ item.advertiser.username }}
            <span class="text-sm text-disabled d-block"> {{ item.advertiser.role }}</span>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
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
    </div>
  </section>
</template>

<style lang="scss" scoped>
:deep(.app-table th) {
  white-space: nowrap;
}
</style>
