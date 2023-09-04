<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { Advertiser } from '@/interfaces/Advertiser'
import type { pageAction } from '@/interfaces/Shared'
import { advertisersService } from '@/services/AdvertisersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('@/components/advertisers/AdvertisersFilter.vue'),
)
const { t } = useI18n()
const toast = useToast()
const { hasPermission, canAccessPage } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'advertisers'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
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
} = UseCrudHelpers<Advertiser>(advertisersService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'الاسم/البريد الالكتروني',
    key: 'account_name',
  },
  {
    title: 'الدولة/المدينة',
    key: 'country_name',
  },
  {
    title: 'تاريخ الانشاء/رقم الجوال',
    key: 'created_at',
  },
  {
    title: 'المتابعين/الإعلانات/التقييم',
    key: 'followers_count',
    align: 'center',
  },
  {
    title: 'الحالة',
    key: 'is_active',
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
  delete: hasPermission('delete_advertiser'),
  changeStatus: hasPermission('change_status_advertiser'),
  viewRequests: canAccessPage('ads_requests'),
  viewCoupons: canAccessPage('advertiser_coupons'),
  viewWallet: canAccessPage('wallets'),
  viewLogs: canAccessPage('advertiser_logs'),
  viewAdvertiserDetails: canAccessPage('advertiser_details'),
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
function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}

function deleteItem(item: Advertiser) {
  IsLoadingData.value = true
  advertisersService
    .deleteItem(item.id)
    .then((res) => {
      item.is_deleted = true
      toast.success(res.data.message)
    })
    .catch(() => {
      item.is_deleted = false
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

async function showConfirmDeleteItem(item: Advertiser): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteItem(item)
}

// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard title="المعلنين" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :show-multi-delete="permissions.delete"
          :show-multi-activate="permissions.changeStatus"
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
          <template #item.account_name="{ item }">
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
              <div style="min-width: 205px">
                {{ item.raw.account_name }}
                <span class="text-sm text-disabled d-block">{{ item.raw.email }}</span>
              </div>
            </div>
          </template>
          <template #item.country_name="{ item }">
            <div style="min-width: 150px">
              {{ item.raw.country_name }}
              <span class="text-sm text-disabled d-block">{{ item.raw.area_name }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.created_at) }}
              <span class="text-sm text-disabled d-block"> {{ item.raw.phone }}</span>
            </div>
          </template>
          <template #item.followers_count="{ item }">
            <div class="text-no-wrap">
              {{ item.raw.followers_count }} / {{ item.raw.ads_count }}
              <span class="d-flex align-center justify-center text-sm">
                <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                {{ item.raw.rate }}
              </span>
            </div>
          </template>
          <template #item.is_active="{ item }">
            <ToggleActivationSwitch
              :id="item.raw.id"
              v-model="item.raw.is_active"
              :model="MODEL_NAME"
              :disabled="!permissions.changeStatus || item.raw.is_deleted"
            />
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewAdvertiserDetails"
                :to="{ name: 'advertisers-profile-page', params: { id: item.raw.id } }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      v-if="!item.raw.is_deleted"
                      :disabled="!permissions.delete"
                      @click="showConfirmDeleteItem(item.raw)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>

                      <VListItemTitle>حذف</VListItemTitle>
                    </VListItem>
                    <VListItem v-if="permissions.viewRequests">
                      <template #prepend>
                        <VIcon icon="tabler-package" />
                      </template>

                      <VListItemTitle>الطلبات</VListItemTitle>
                    </VListItem>
                    <VListItem v-if="permissions.viewCoupons">
                      <template #prepend>
                        <VIcon icon="tabler-discount-2" />
                      </template>

                      <VListItemTitle>الكوبونات</VListItemTitle>
                    </VListItem>
                    <VListItem v-if="permissions.viewWallet">
                      <template #prepend>
                        <VIcon icon="tabler-wallet" />
                      </template>

                      <VListItemTitle>سجل المحفظة</VListItemTitle>
                    </VListItem>
                    <VListItem v-if="permissions.viewLogs">
                      <template #prepend>
                        <VIcon icon="tabler-history" />
                      </template>

                      <VListItemTitle>سجل العمليات</VListItemTitle>
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
