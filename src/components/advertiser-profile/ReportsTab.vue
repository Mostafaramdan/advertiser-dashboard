<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import type { AdvertiserReportItem } from '@/modules/reports/interfaces/AdvertiserReport'
import { reportsService } from '@/modules/reports/services/ReportsService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'reports'
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const advertiserId = +route.params.id
const selectedItems = ref<number[]>([])
const tableData = ref<AdvertiserReportItem[]>([])
const metaData = ref<MetaData | null>(null)
const confirmModal = ref<any>()
const isLoadingData = ref<boolean>(false)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'رقم البلاغ',
    key: 'id',
  },
  {
    title: 'اسم المبلغ',
    key: 'reporter.account_name',
  },
  {
    title: 'تاريخ الابلاغ',
    key: 'created_at',
  },
  {
    title: 'نص البلاغ',
    key: 'report_content',
  },
  {
    title: 'رقم الجوال',
    key: 'reporter.phone',
  },
  {
    title: 'الدولة',
    key: 'reporter.country_name',
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
  delete: hasPermission('delete_advertiser_report'),
  sendNotification: hasPermission('notify_users'),
}))

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
  reportsService
    .getAdvertisersReportsDetails({ id: advertiserId, params })
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

/**
 * @description reload page data and reset selected items
 */
function onReloadData(): void {
  reloadPageData()
  selectedItems.value = []
}

/**
 * @description delete item from table data after delete from server and update meta data
 * @param  {AdvertiserReportItem} item
 * @return  {void}
 */
function deleteItemFromTableData(item: AdvertiserReportItem): void {
  const targetIndex = tableData.value.findIndex((i: any) => i.id === item.id)

  if (targetIndex === -1) return
  tableData.value.splice(targetIndex, 1)

  if (metaData.value) {
    metaData.value.total -= 1
    metaData.value.last_page = Math.ceil(metaData.value.total / params.itemPerPage)
    if (tableData.value.length === 0 && metaData.value.current_page > 1) {
      params.page = metaData.value.current_page - 1
      getPageData()
    }

    // handle it for first page
    else if (tableData.value.length === 0 && metaData.value.current_page === 1) {
      getPageData()
    }
  }
}

/**
 * @description delete item from selected items
 * @param  {AdvertiserReportItem} item
 * @return  {void}
 */
function deleteItemFromSelectedItems(item: AdvertiserReportItem): void {
  const targetItemIndex = selectedItems.value.findIndex((i: number) => i === item.id)

  if (targetItemIndex !== -1) selectedItems.value.splice(targetItemIndex, 1)
}

/**
 * @description delete item from server
 * @param  {AdvertiserReportItem} item
 * @return  {void}
 */
function deleteItem(item: AdvertiserReportItem): void {
  deleteItemFromSelectedItems(item)

  isLoadingData.value = true
  reportsService
    .deleteAdvertisersReport(item.id as number)
    .then((res: any) => {
      toast.success(res.data.message)
      deleteItemFromTableData(item)
    })
    .finally(() => {
      isLoadingData.value = false
    })
}

/**
 * @description show confirm modal before delete item
 * @param  {AdvertiserReportItem} item
 * @return  {Promise<void>}
 */
async function showConfirmDeleteItem(item: AdvertiserReportItem): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteItem(item)
}

function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

// #endregion
</script>

<template>
  <section>
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <ConfirmModal ref="confirmModal" />
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        :show-multi-delete="permissions.delete"
        :model="MODEL_NAME"
        :selected-items="selectedItems"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="onReloadData"
      />

      <VDataTableServer
        v-model="selectedItems"
        v-loading="isLoadingData"
        :headers="headers"
        :items="tableData"
        show-select
        :items-length="metaData?.total || 0"
        item-value="id"
        class="app-table"
        :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.reporter.account_name="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.raw.reporter.account_name }}
          </div>
        </template>
        <template #item.report_content="{ item }">
          <div style="inline-size: 250px">
            {{ item.raw.report_content }}
          </div>
        </template>
        <template #item.reporter.country_name="{ item }">
          <div style="min-inline-size: 100px">
            {{ item.raw.reporter.country_name }}
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.raw.created_at) }}
            <span class="text-sm text-disabled d-block"> {{ item.raw.phone }}</span>
          </div>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item.raw)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
            <IconBtn
              :disabled="!permissions.sendNotification"
              @click="openNotificationModal(item.raw.reporter)"
            >
              <VIcon icon="tabler-mail" />
            </IconBtn>
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
