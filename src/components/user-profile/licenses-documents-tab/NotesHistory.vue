<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import type { LicenseDocumentNote } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'

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
const tableData = ref<LicenseDocumentNote[]>([])
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
    title: 'مدون الملاحظة',
    key: 'admin_name',
  },
  {
    title: 'تاريخ التدوين',
    key: 'created_at',
  },
  {
    title: 'بيان الملاحظة',
    key: 'note',
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
    .getLicenseDocumentNotes(props.activeId, params.value)
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
  <div class="notifications-history">
    <VDataTableServer
      v-loading="isLoading"
      :headers="headers"
      :items="tableData"
      :items-length="tableData.length"
      class="app-table"
      :no-data-text="isLoading ? t('general.loading') : t('general.no_data')"
    >
      <template #item.admin_name="{ item }">
        <div style="min-inline-size: 100px">
          {{ item.admin_name }}
        </div>
      </template>
      <template #item.created_at="{ item }">
        <div class="text-no-wrap">
          {{ formatDateTime(item.created_at) }}
        </div>
      </template>
      <template #item.note="{ item }">
        <div style="min-inline-size: 300px">
          {{ item.note }}
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
