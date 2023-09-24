<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { REQUEST_STATUSES } from '@/constants/subscriptions'
import type { pageAction } from '@/interfaces/Shared'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import SubscriptionsLogsStats from '../components/SubscriptionsLogsStats.vue'
import type { SubscriptionsLogsItem } from '../interfaces/SubscriptionsRequests'
import { subscriptionsLogsService } from '../services/SubscriptionsLogsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('../components/SubscriptionsRequestsFilter.vue'),
)
const { t } = useI18n()
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'subscription_requests_logs'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const filterExtraData = ref<any>({})

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const {
  selectedItems,
  tableData,
  metaData,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
} = UseCrudHelpers<SubscriptionsLogsItem>(subscriptionsLogsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'اسم المشترك/اسم الباقة',
    key: 'account_name',
  },
  {
    title: 'النوع/تاريخ الاشتراك',
    key: 'type',
  },
  {
    title: 'مدة الاشتراك / المدة المتبقية',
    key: 'period',
  },
  {
    title: 'مبلغ الدفع/قناة لدفع',
    key: 'price',
  },
  {
    title: 'حالة الاشتراك',
    key: 'request_status',
    align: 'center',
  },
  {
    title: 'تاريخ الاكشن',
    key: 'created_at',
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const pageActionsButtons = computed<pageAction[]>(() => {
  return [
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
const { user_id, advertiser_name } = route.query
if (user_id) params.user_id = +user_id
if (advertiser_name) filterExtraData.value.advertiser_name = advertiser_name

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
  <section>
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
      :extra-data="filterExtraData"
    />
    <VCard class="page-card" title="سجل الاشتراكات">
      <VCardText>
        <SubscriptionsLogsStats />
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :model="MODEL_NAME"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-model="selectedItems"
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.account_name="{ item }">
            <div style="min-width: 200px">
              {{ item.raw.account_name }}
              <span class="text-sm text-disabled d-block">{{ item.raw.packageName }}</span>
            </div>
          </template>
          <template #item.period="{ item }">
            <div style="min-width: 100px">
              {{ item.raw.period }}
              <span class="text-sm text-disabled d-block">{{ item.raw.remaining_days_str }}</span>
            </div>
          </template>
          <template #item.type="{ item }">
            <div style="min-width: 100px">
              {{ item.raw.type }}
              <span class="text-sm text-disabled d-block">{{
                formatDateTime(item.raw.start_date)
              }}</span>
            </div>
          </template>
          <template #item.price="{ item }">
            <div style="min-width: 100px">
              {{ item.raw.price }}
              <span class="text-sm text-disabled d-block">{{ item.raw.payment_method }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.created_at) }}
            </div>
          </template>
          <template #item.request_status="{ item }">
            <VChip color="dark">
              {{ REQUEST_STATUSES[item.raw.request_status] }}
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
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 200px;
  word-wrap: break-word;
}
</style>
