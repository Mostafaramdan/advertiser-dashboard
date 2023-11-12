<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { GENDER_TYPES } from '@/constants/index'
import type { pageAction } from '@/interfaces/Shared'
import type { User } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('@/components/users/UsersFilter.vue'))
const { t } = useI18n()
const toast = useToast()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'users'
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
} = UseCrudHelpers<User>(usersService, params, MODEL_NAME)

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
    title: 'الجنس/التقييم',
    key: 'gender',
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
  delete: hasPermission('delete_users'),
  changeStatus: hasPermission('change_status_user'),
  viewRequests: hasPermission('view_ads_requests'),
  viewCoupons: hasPermission('view_user_coupons'),
  viewWallet: hasPermission('view_wallets'),
  viewLogs: hasPermission('view_user_logs'),
  viewUserDetails: hasPermission('view_user_details'),
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

function deleteItem(item: User) {
  IsLoadingData.value = true
  usersService
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

async function showConfirmDeleteItem(item: User): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteItem(item)
}

function rowProps({ item }: { item: User }) {
  return {
    class: item.is_deleted && 'bg-background',
  }
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
    <VCard title="المستخدمين" class="page-card">
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
          :row-props="rowProps"
        >
          <template #item.account_name="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.image_path" :src="item.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <VChip v-if="item.is_deleted" class="px-0 mt-1" color="error" label size="x-small">
                  محذوف
                </VChip>
              </div>
              <div style="min-inline-size: 205px">
                {{ item.account_name }}
                <span class="text-sm text-disabled d-block">{{ item.email }}</span>
              </div>
            </div>
          </template>
          <template #item.country_name="{ item }">
            <div style="min-inline-size: 150px">
              {{ item.country_name }}
              <span class="text-sm text-disabled d-block">{{ item.area_name }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.created_at) }}
              <span class="text-sm text-disabled d-block"> {{ item.phone }}</span>
            </div>
          </template>
          <template #item.gender="{ item }">
            <div class="text-no-wrap">
              {{ GENDER_TYPES[item.gender as 'male' | 'female'] }}
              <span class="d-flex align-center justify-center text-sm">
                <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                {{ item.rate }}
              </span>
            </div>
          </template>
          <template #item.is_active="{ item }">
            <ToggleActivationSwitch
              :id="item.id"
              v-model="item.is_active"
              :model="MODEL_NAME"
              :disabled="!permissions.changeStatus || item.is_deleted"
            />
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewUserDetails"
                :to="{
                  name: 'user-profile-page',
                  params: { id: item.id },
                  query: { tab: 'details' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      v-if="!item.is_deleted"
                      :disabled="!permissions.delete"
                      @click="showConfirmDeleteItem(item)"
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
