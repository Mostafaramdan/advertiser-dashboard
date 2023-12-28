<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { ADS_SPACE_REQUEST_STATUSES } from '@/constants/ads-spaces'
import { useAuthStore } from '@/stores/AuthStore'
import type { AdSpaceRequest } from '../interfaces/AdsSpace'
import AdsSpaceRequestDetailsModal from '../modals/AdsSpaceRequestDetailsModal.vue'
import AdsSpaceRequestLogsModal from '../modals/AdsSpaceRequestLogsModal.vue'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const adSpaceId = +route.params.id
const showLogsModal = ref<boolean>(false)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const { tableData, metaData, IsLoadingData, showDetailsModal, showViewModal, activeItem } =
  UseCrudHelpers<AdSpaceRequest>(null, null, '')

const headers: any = [
  {
    title: 'صاحب الطلب',
    key: 'user',
  },
  {
    title: 'تاريخ الانشاء/تاريخ النهاية',
    key: 'created_at',
  },
  {
    title: 'سعر المشاهدة/مشاهدات المشاركة',
    key: 'watch_price',
  },
  {
    title: 'المشاهدات المسحوبة/المشاهدات المتبقية',
    key: 'watches_count_requested',
  },
  {
    title: 'حالة الطلب/الساعات المتبقية',
    key: 'status',
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
  viewLogs: hasPermission('view_space_requests_logs'),
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
  adsSpacesService
    .getRequests({ id: adSpaceId, params })
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

function openHistoryModal(item: AdSpaceRequest): void {
  activeItem.value = item
  showLogsModal.value = true
}
// #endregion
</script>

<template>
  <section>
    <AdsSpaceRequestDetailsModal
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
      v-if="showDetailsModal"
    />
    <AdsSpaceRequestLogsModal
      :active-id="activeItem?.id"
      v-if="showLogsModal && activeItem"
      v-model:showModal="showLogsModal"
    />
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="reloadPageData"
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
          <div class="d-flex align-center">
            <div class="d-flex flex-column align-center me-3 py-1">
              <VAvatar size="38" variant="tonal" cover>
                <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
            </div>
            <span>
              <span>{{ item.user.username }}</span>
              <span class="text-sm text-disabled d-block">{{ item.user.phone }}</span>
            </span>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
            <span class="text-sm text-disabled d-block"> {{ formatDateTime(item.ended_at) }}</span>
          </div>
        </template>
        <template #item.watch_price="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 110px">
            <span>{{ item.watch_price }} {{ item.currency_name }}</span>
            <span class="text-sm text-disabled d-block">{{ item.shares_watches_count }}</span>
          </div>
        </template>
        <template #item.watches_count_requested="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 120px">
            {{ item.watches_count_requested }}
            <span class="text-sm text-disabled d-block">{{ item.remaining_watches_count }}</span>
          </div>
        </template>
        <template #item.status="{ item }">
          <div style="min-inline-size: 100px">
            {{ ADS_SPACE_REQUEST_STATUSES.get(item.status)?.label }}
            <span class="text-sm text-disabled d-block">{{ item.remaining_hours }}</span>
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn @click="showViewModal(item)">
              <VIcon icon="tabler-eye" />
            </IconBtn>
            <IconBtn @click="openHistoryModal(item)" :disabled="!permissions.viewLogs">
              <VIcon icon="tabler-history" />
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

<style lang="scss" scoped></style>
