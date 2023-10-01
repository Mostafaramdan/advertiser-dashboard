<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { AdvertiserReport } from '../interfaces/AdvertiserReport'
import { reportsService } from '../services/ReportsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const MODEL_NAME = 'reports'
const selectedItems = ref<number[]>([])
const tableData = ref<AdvertiserReport[]>([])
const metaData = ref<MetaData | null>(null)
const confirmModal = ref<any>()
const isLoadingData = ref<boolean>(false)
const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'صاحب الرسالة',
    key: 'reported',
  },
  {
    title: 'المبلغ',
    key: 'reporter',
  },
  {
    title: 'تاريخ التبليغ',
    key: 'report_date',
  },
  {
    title: 'الرسالة المبلغ عنها',
    key: 'message',
  },
  {
    title: 'نص البلاغ',
    key: 'report_content',
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
  delete: hasPermission('delete_chat_report'),
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
    .getChatReports(params)
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
 * @param  {any} item
 * @return  {void}
 */
function deleteItemFromTableData(item: any): void {
  const targetIndex = tableData.value.findIndex((i: any) => i.id === item.id)

  if (targetIndex === -1) return
  tableData.value.splice(targetIndex, 1)

  // update sort for table data
  if (item.sort) {
    for (let i = targetIndex; i < tableData.value.length; i++)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (tableData.value[i].sort) tableData.value[i].sort -= 1
  }

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
 * @param  {any} item
 * @return  {void}
 */
function deleteItemFromSelectedItems(item: any): void {
  const targetItemIndex = selectedItems.value.findIndex((i: number) => i === item.id)

  if (targetItemIndex !== -1) selectedItems.value.splice(targetItemIndex, 1)
}

/**
 * @description delete item from server
 * @param  {any} item
 * @return  {void}
 */
function deleteItem(item: AdvertiserReport): void {
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
 * @param  {ItemType} item
 * @return  {Promise<void>}
 */
async function showConfirmDeleteItem(item: any): Promise<void> {
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
    <VCard title="بلاغات الشات" class="page-card">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
          :selected-items="selectedItems"
          :show-multi-delete="permissions.delete"
          :model="MODEL_NAME"
        />
        <VDataTableServer
          v-model="selectedItems"
          v-loading="isLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          item-value="id"
          show-select
          class="app-table"
          :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.reported="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.reported.image_path"
                    :src="item.raw.reported.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 80px">
                <span>{{ item.raw.reported.username }}</span>
              </div>
            </div>
          </template>
          <template #item.reporter="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.reporter.image_path"
                    :src="item.raw.reporter.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 80px">
                <span>{{ item.raw.reporter.username }}</span>
              </div>
            </div>
          </template>
          <template #item.report_date="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.report_date) }}
            </div>
          </template>
          <template #item.message="{ item }">
            <div class="my-2" style="min-width: 150px; max-width: 280px">
              {{ item.raw.message }}
            </div>
          </template>
          <template #item.report_content="{ item }">
            <div class="my-2" style="min-width: 150px; max-width: 280px">
              {{ item.raw.report_content }}
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item.raw)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.raw.reported)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>

                      <VListItemTitle>إرسال تنبيه لصاحب الرسالة</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.raw.reporter)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>

                      <VListItemTitle>إرسال تنبيه للمبلغ</VListItemTitle>
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
:deep(.v-data-table .v-table__wrapper > table td) {
  font-size: 13px;
  word-break: break-word;
}
</style>
