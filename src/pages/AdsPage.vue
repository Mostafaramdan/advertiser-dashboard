<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdsListItem } from '@/interfaces/Ads'
import type { pageAction } from '@/interfaces/Shared'
import { adsService } from '@/services/AdsService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('@/components/ads/AdsFilter.vue'))
const toast = useToast()
const { t } = useI18n()
const route = useRoute()
const { hasPermission, canAccessPage } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'ads'
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
  viewAdDetails: canAccessPage('ads_details'),
  restore: hasPermission('restore_ads'),
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
const { advertiser_id, advertiser_name, ad_request_id } = route.query
if (advertiser_id) params.advertiser_id = +advertiser_id
if (advertiser_name) filterExtraData.value.advertiser_name = advertiser_name
if (ad_request_id) params.ad_request_id = +ad_request_id
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

function deleteItem(item: AdsListItem) {
  IsLoadingData.value = true
  adsService
    .deleteItem(item.id)
    .then((res) => {
      item.is_deleted = true
      toast.success(res.data.message)
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

function restoreItem(item: AdsListItem) {
  IsLoadingData.value = true
  adsService
    .restoreItem(item.id)
    .then((res) => {
      item.is_deleted = false
      toast.success(res.data.message)
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

async function showConfirmModal(item: AdsListItem): Promise<void> {
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
      :extra-data="filterExtraData"
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
                <VChip
                  v-if="item.raw.is_deleted"
                  class="px-0 mt-1"
                  color="error"
                  label
                  size="x-small"
                >
                  محذوف
                </VChip>
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
                :disabled="!permissions.viewAdDetails"
                :to="{
                  name: 'ad-details-page',
                  params: { id: item.raw.id },
                  query: { tab: 'details' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <IconBtn
                :disabled="!permissions.delete"
                @click="showConfirmModal(item.raw)"
                v-if="!item.raw.is_deleted"
              >
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <IconBtn
                @click="showConfirmModal(item.raw)"
                v-else="!item.raw.is_deleted"
                :disabled="!permissions.restore"
              >
                <VIcon icon="tabler-restore" />
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
