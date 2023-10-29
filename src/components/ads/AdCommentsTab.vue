<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdComment } from '@/interfaces/Ads'
import { adsService } from '@/services/AdsService'
import { useAdsStore } from '@/stores/AdsStore'
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
const adsStore = useAdsStore()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'comments'
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
} = UseCrudHelpers<AdComment>(null, params, MODEL_NAME)

const headers: any = [
  {
    title: 'اسم المعلق',
    key: 'commenter.account_name',
  },
  {
    title: 'تاريخ التعليق',
    key: 'created_at',
  },
  {
    title: 'الاعجابات',
    key: 'likes_count',
  },
  {
    title: 'نص التعليق',
    key: 'comment',
  },
  {
    title: 'رقم الجوال',
    key: 'commenter.phone',
  },
  {
    title: 'الدولة',
    key: 'commenter.country_name',
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
  delete: hasPermission('delete_comment'),
  sendNotification: hasPermission('notify_users'),
}))

const commentsOptions = computed(() => {
  if (!adsStore.adDetails) return []
  const options = [
    {
      label: 'تعليقات المعلن',
      value: adsStore.adDetails.advertiser.id,
    },
  ]

  if (adsStore.adDetails.user) {
    options.push({
      label: 'تعليقات العميل',
      value: adsStore.adDetails.user.id,
    })
  }
  return options
})
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
    .getComments({ id: adId, params })
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
function deleteItem(item: AdComment): void {
  deleteItemFromSelectedItems(item)

  IsLoadingData.value = true
  adsService
    .deleteComment(item.id as number)
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
      >
        <div class="v-col-md-4 pa-0">
          <AppSelect
            v-model="params.user_id"
            name="type"
            :items="commentsOptions"
            :loading="!commentsOptions.length"
            :disabled="!commentsOptions.length"
            item-title="label"
            item-value="value"
            label="نوع التعليقات"
            hide-default-label
            @update:model-value="onReloadData"
            clearable
          >
          </AppSelect>
        </div>
        <span class="me-auto" />
      </PageActions>
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
        <template #item.commenter.account_name="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.raw.commenter.account_name }}
          </div>
        </template>
        <template #item.comment="{ item }">
          <div style="inline-size: 250px">
            {{ item.raw.comment }}
          </div>
        </template>
        <template #item.commenter.country_name="{ item }">
          <div style="min-inline-size: 100px">
            {{ item.raw.commenter.country_name || '-' }}
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
              @click="openNotificationModal(item.raw.commenter)"
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

<style lang="scss" scoped>
:deep(.search-input) {
  margin: 0 !important;
}
</style>
