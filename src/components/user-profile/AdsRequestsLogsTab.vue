<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import type { AdRequestLogItem } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const userId = +route.params.id
const tableData = ref<AdRequestLogItem[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'رقم الحركة',
    key: 'id',
  },
  {
    title: 'اسم المستخدم',
    key: 'username',
  },
  {
    title: 'تاريخ الحركة',
    key: 'created_at',
  },
  {
    title: 'اسم الحركة',
    key: 'action_type',
  },
  {
    title: 'الوصف',
    key: 'details',
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
  isLoadingData.value = true
  usersService
    .getAdsRequestsLogs({ id: userId, params })
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      isLoadingData.value = false
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

// #endregion
</script>

<template>
  <section>
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="reloadPageData"
      />

      <VDataTableServer
        v-loading="isLoadingData"
        :headers="headers"
        :items="tableData"
        :items-length="metaData?.total || 0"
        class="app-table"
        :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.username="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.username }}
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
          </div>
        </template>
        <template #item.details="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.details || '-' }}
          </div>
        </template>
        <template #item.action_type="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.action_type || '-' }}
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
