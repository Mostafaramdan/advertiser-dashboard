<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdsRequestsItem } from '@/interfaces/AdsRequest'
import type { pageAction } from '@/interfaces/Shared'
import { adsRequestsService } from '@/services/AdsRequestsService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('@/components/ads-requests/AdsRequestsFilter.vue'),
)
const { t } = useI18n()
const route = useRoute()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'ads_requests'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const filterExtraData = ref<any>({})
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  advertiser_id: null,
  user_id: null,
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showConfirmDeleteItem,
} = UseCrudHelpers<AdsRequestsItem>(adsRequestsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'اسم المعلن/اسم العميل',
    key: 'advertiser',
  },
  {
    title: 'تاريخ الطلب/رقم الطلب',
    key: 'created_at',
  },
  {
    title: 'قيمة الطلب/عمولة المنصة',
    key: 'price',
  },
  {
    title: 'طريقة الدفع/حالة الدفع',
    key: 'payment_status',
  },
  {
    title: 'حالة الطلب',
    key: 'ads_request_status',
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
  delete: hasPermission('delete_ads_request'),
  viewAdsRequestDetails: hasPermission('view_ads_requests_details'),
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
const { advertiser_id, advertiser_name, user_id, user_name } = route.query
if (advertiser_id) params.advertiser_id = +advertiser_id
if (advertiser_name) filterExtraData.value.advertiser_name = advertiser_name
if (user_id) params.user_id = +user_id
if (user_name) filterExtraData.value.user_name = user_name
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
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
      :extra-data="filterExtraData"
    />
    <VCard title="طلبات الاعلان" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
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
          <template #item.advertiser="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.advertiser.image_path" :src="item.advertiser.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-inline-size: 205px">
                {{ item.advertiser.username }}
                <span class="text-sm text-disabled d-block">{{ item.user.username }}</span>
              </div>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.created_at) }}
              <span class="text-sm text-disabled d-block">{{ item.id }} </span>
            </div>
          </template>
          <template #item.price="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.price }}
              <span class="text-sm text-disabled d-block"> {{ item.commission }}</span>
            </div>
          </template>
          <template #item.payment_status="{ item }">
            <div style="min-inline-size: 100px">
              {{ item.payment_method }}
              <span class="text-sm text-disabled d-block">{{ item.payment_status }}</span>
            </div>
          </template>
          <template #item.ads_request_status="{ item }">
            <div style="min-inline-size: 80px">
              {{ item.ads_request_status }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewAdsRequestDetails"
                :to="{
                  name: 'ads-request-details-page',
                  params: { id: item.id },
                  query: { tab: 'details' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.advertiser)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>
                      <VListItemTitle>ارسال اشعار للمعلن</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.user)"
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

  .v-img__img--contain {
    object-fit: cover;
  }
}
</style>
