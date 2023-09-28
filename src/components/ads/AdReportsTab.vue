<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdReport } from '@/interfaces/Ads'
import { adsService } from '@/services/AdsService'
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
const adId = +route.params.id

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  deleteItemFromTableData,
  deleteItemFromSelectedItems,
} = UseCrudHelpers<AdReport>(null, params, MODEL_NAME)

const headers: any = [
  {
    title: 'رقم البلاغ',
    key: 'id',
  },
  {
    title: 'اسم المبلغ',
    key: 'user.username',
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
    key: 'user.phone',
  },
  {
    title: 'الدولة',
    key: 'user.country',
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
  delete: hasPermission('delete_report'),
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
  IsLoadingData.value = true
  adsService
    .getReports({ id: adId, params })
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
  selectedItems.value = []
}

/**
 * @description delete item from server
 * @param  {any} item
 * @return  {void}
 */
function deleteItem(item: AdReport): void {
  deleteItemFromSelectedItems(item)

  IsLoadingData.value = true
  adsService
    .deleteReport(item.id as number)
    .then((res: any) => {
      toast.success(res.data.message)
      deleteItemFromTableData(item)
    })
    .finally(() => {
      IsLoadingData.value = false
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
        v-loading="IsLoadingData"
        :headers="headers"
        :items="tableData"
        show-select
        :items-length="metaData?.total || 0"
        item-value="id"
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.user.username="{ item }">
          <div style="min-width: 150px">
            {{ item.raw.user.username }}
          </div>
        </template>
        <template #item.report_content="{ item }">
          <div style="width: 250px">
            {{ item.raw.report_content }}
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
            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem
                    v-if="permissions.sendNotification"
                    @click="openNotificationModal(item.raw.advertiser)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-mail" />
                    </template>
                    <VListItemTitle>ارسال اشعار للمعلن</VListItemTitle>
                  </VListItem>
                  <VListItem
                    v-if="permissions.sendNotification && item.raw.user"
                    @click="openNotificationModal(item.raw.user)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-mail" />
                    </template>
                    <VListItemTitle>ارسال اشعار للعميل</VListItemTitle>
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
    </div>
  </section>
</template>
