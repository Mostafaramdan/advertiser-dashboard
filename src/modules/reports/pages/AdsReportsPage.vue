<script setup lang="ts">
import type { MetaData, pageAction } from '@/interfaces/Shared'
import { adsService } from '@/services/AdsService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { AdsReport } from '../interfaces/AdsReport'
import { reportsService } from '../services/ReportsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('../components/AdsReportsFilter.vue'))
const toast = useToast()
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const ADS_MODEL_NAME = 'ads'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)

const tableData = ref<AdsReport[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)
const confirmModal = ref<any>()
const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'المعلن',
    key: 'advertiser',
  },
  {
    title: 'عدد البلاغات/نسبة البلاغات',
    key: 'reports_count',
  },
  {
    title: 'المشاهدات/حالة الحذف',
    key: 'seen_count',
  },
  {
    title: 'وصف الاعلان',
    key: 'ads_description',
  },
  {
    title: 'حالة الاعلان',
    key: 'is_active_ad',
    align: 'center',
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
  changeAdStatus: hasPermission('change_status_ads'),
  viewAdDetails: hasPermission('view_ads_details'),
  deleteAd: hasPermission('delete_ads'),
  restoreAd: hasPermission('restore_ads'),
}))

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
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData(): void {
  isLoadingData.value = true
  reportsService
    .getAdsReports(params)
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
}

function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}

function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

function deleteItem(item: AdsReport) {
  isLoadingData.value = true
  adsService
    .deleteItem(item.ad_id)
    .then((res) => {
      item.is_deleted = true
      toast.success(res.data.message)
    })
    .finally(() => {
      isLoadingData.value = false
    })
}

function restoreItem(item: AdsReport) {
  isLoadingData.value = true
  adsService
    .restoreItem(item.ad_id)
    .then((res) => {
      item.is_deleted = false
      toast.success(res.data.message)
    })
    .finally(() => {
      isLoadingData.value = false
    })
}

async function showConfirmModal(item: AdsReport): Promise<void> {
  const confirmDescription = item.is_deleted
    ? 'هل انت متاكد من استرجاع الاعلان'
    : 'هل انت متاكد من حذف الاعلان'
  const confirm = await confirmModal.value.open('يرجي التاكيد', confirmDescription)

  if (!confirm) return

  if (!item.is_deleted) deleteItem(item)
  else restoreItem(item)
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
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <VCard title="بلاغات الاعلانات" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-loading="isLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.advertiser="{ item }">
            <router-link
              :to="{
                name: 'advertisers-profile-page',
                params: { id: item.raw.advertiser.id },
                query: { tab: 'details' },
              }"
              class="d-flex align-center"
            >
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.advertiser.image_path"
                    :src="item.raw.advertiser.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-inline-size: 205px">
                <span>{{ item.raw.advertiser.username }}</span>
                <span class="text-sm text-disabled d-block">{{ item.raw.advertiser.phone }}</span>
              </div>
            </router-link>
          </template>
          <template #item.reports_count="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.raw.reports_count }}
              <span class="text-sm text-disabled d-block">{{ item.raw.report_rate }}%</span>
            </div>
          </template>
          <template #item.seen_count="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.raw.seen_count }}
              <div class="d-flex">
                <VChip
                  class="px-2 mt-1"
                  :color="item.raw.is_deleted ? 'error' : 'success'"
                  label
                  size="x-small"
                >
                  {{ item.raw.is_deleted ? 'محذوف' : 'متواجد' }}
                </VChip>
              </div>
            </div>
          </template>
          <template #item.ads_description="{ item }">
            <span style="inline-size: 180px">
              {{ item.raw.ads_description }}
            </span>
          </template>
          <template #item.is_active_ad="{ item }">
            <div class="d-flex justify-center">
              <ToggleActivationSwitch
                :id="item.raw.ad_id"
                v-model="item.raw.is_active_ad"
                :model="ADS_MODEL_NAME"
                :disabled="!permissions.changeAdStatus"
              />
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewAdDetails"
                :to="{
                  name: 'ad-details-page',
                  params: { id: item.raw.ad_id },
                  query: { tab: 'reports' },
                }"
              >
                <VIcon icon="tabler-eye" />
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
                      :disabled="!permissions.deleteAd"
                      @click="showConfirmModal(item.raw)"
                      v-if="!item.raw.is_deleted"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>حذف الاعلان</VListItemTitle>
                    </VListItem>
                    <VListItem
                      @click="showConfirmModal(item.raw)"
                      v-else="!item.raw.is_deleted"
                      :disabled="!permissions.restoreAd"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-restore" />
                      </template>
                      <VListItemTitle>استرجاع الاعلان</VListItemTitle>
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
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
