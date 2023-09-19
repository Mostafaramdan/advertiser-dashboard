<script setup lang="ts">
import AdDetailsModal from '@/components/ads/AdDetailsModal.vue'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdsListItem } from '@/interfaces/Ads'
import type { pageAction } from '@/interfaces/Shared'
import { adsService } from '@/services/AdsService'
import { useAuthStore } from '@/stores/AuthStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('@/components/ads/AdsFilter.vue'))
const { t } = useI18n()
const route = useRoute()
const { hasPermission, canAccessPage } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'ads'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  advertiser_id: null,
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  showDetailsModal,
  activeItem,
  showViewModal,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showConfirmDeleteItem,
} = UseCrudHelpers<AdsListItem>(adsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'صورة الاعلان/ طريقة الاعلان',
    key: 'ads_type',
  },
  {
    title: 'ناريخ البداية/تاريخ النهاية',
    key: 'started_at',
  },
  {
    title: 'اماكن العرض/القسم',
    key: 'category_name',
  },
  {
    title: 'حالة الاعلان/المشاهدات',
    key: 'status_txt',
  },
  {
    title: 'اسم المعلن',
    key: 'advertiser',
  },
  {
    title: 'الحالة',
    key: 'is_active',
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
  delete: hasPermission('delete_ads'),
  changeStatus: hasPermission('change_status_ads'),
  viewAdsRequestDetails: canAccessPage('ads_details'),
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
const advertiser_id = route.query?.advertiser_id
if (advertiser_id) params.advertiser_id = +advertiser_id
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
    <AdDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <VCard title="الاعلانات" class="page-card">
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
          :item-selectable="(item) => !item.is_deleted"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.ads_type="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.raw.image_path" :src="item.raw.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 130px">
                {{ item.raw.ads_type }}
                <span class="d-flex align-center text-sm">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                  {{ item.raw.rate }}
                </span>
              </div>
            </div>
          </template>

          <template #item.started_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.started_at) }}
              <span class="text-sm text-disabled d-block">{{
                item.raw.ended_at ? formatDateTime(item.raw.ended_at) : 'لا يوجد'
              }}</span>
            </div>
          </template>

          <template #item.category_name="{ item }">
            <div style="min-width: 120px">
              <div class="d-flex gap-2" v-if="item.raw.ads_locations">
                <VChip
                  variant="outlined"
                  color="primary"
                  label
                  v-if="item.raw.ads_locations.show_app"
                >
                  المنصة
                </VChip>
                <VChip
                  variant="outlined"
                  color="primary"
                  label
                  v-if="item.raw.ads_locations.show_profile"
                >
                  البروفايل
                </VChip>
              </div>
              <div v-else>لا يوجد</div>
              <span class="text-sm text-disabled d-block">
                {{ item.raw.category_name || 'لا يوجد' }}
              </span>
            </div>
          </template>

          <template #item.status_txt="{ item }">
            <div style="min-width: 120px">
              {{ item.raw.status_txt }}
              <span class="text-sm text-disabled d-block">{{ item.raw.seen_count }}</span>
            </div>
          </template>

          <template #item.advertiser="{ item }">
            <span style="width: 120px">
              {{ item.raw.advertiser.username }}
            </span>
          </template>

          <template #item.is_active="{ item }">
            <div class="d-flex justify-center">
              <ToggleActivationSwitch
                :id="item.raw.id"
                v-model="item.raw.is_active"
                :model="MODEL_NAME"
                :disabled="!permissions.changeStatus"
              />
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewAdsRequestDetails"
                :to="{ name: 'ad-details-page', params: { id: item.raw.id } }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item.raw)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="showViewModal(item.raw)">
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>
                      <VListItemTitle>عرض المزيد</VListItemTitle>
                    </VListItem>

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
