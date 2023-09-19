<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import type { LogsHistoryItem } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  activeId: {
    type: Number,
    required: true,
  },
})
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const tableData = ref<LogsHistoryItem[]>([])
const metaData = ref<MetaData | null>(null)
const params = ref({
  page: 1,
  itemPerPage: 10,
})
const headers: any = [
  {
    title: 'رقم الحركة',
    key: 'id',
  },
  {
    title: 'اسم الحركة',
    key: 'action',
  },
  {
    title: 'تاريخ الحركة',
    key: 'created_at',
  },
  {
    title: 'صاحب الحركة',
    key: 'confirmed_by',
  },
  {
    title: 'تاريخ الموافقة',
    key: 'confirmed_at',
  },
]

//#endregion

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
  isLoading.value = true
  usersService
    .getLogsHistory(props.activeId, params.value)
    .then((res) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <div class="logs-history">
    <VDataTableServer
      v-loading="isLoading"
      :headers="headers"
      :items="tableData"
      :items-length="tableData.length"
      class="app-table"
      :no-data-text="isLoading ? t('general.loading') : t('general.no_data')"
    >
      <template #item.action="{ item }">
        <div style="min-width: 100px">
          {{ item.raw.action }}
        </div>
      </template>
      <template #item.confirmed_by="{ item }">
        <div style="min-width: 200px">
          {{ item.raw.confirmed_by || '-' }}
        </div>
      </template>
      <template #item.created_at="{ item }">
        <div class="text-no-wrap">
          {{ formatDateTime(item.raw.created_at) }}
        </div>
      </template>
      <template #item.confirmed_at="{ item }">
        <div class="text-no-wrap">
          {{ formatDateTime(item.raw.confirmed_at) }}
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
</template>
