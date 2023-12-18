<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { SubscriptionsListItem } from '../interfaces/SubscriptionsList'
import { subscriptionsPackagesService } from '../services/SubscriptionsPackagesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'packages'

const packagesTypesOptions = [
  { value: 0, label: 'كل الباقات' },
  { value: 1, label: 'الباقة الاساسية' },
]

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  is_default: 0,
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
  sortItems,
} = UseCrudHelpers<SubscriptionsListItem>(subscriptionsPackagesService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'الاسم',
    key: 'name',
  },
  {
    title: 'تاريخ الانشاء',
    key: 'created_at',
  },
  {
    title: 'عدد المشتركين',
    key: 'subscribers_count',
    align: 'center',
  },
  {
    title: 'مجموع قيمة الاشتراكات',
    key: 'subscriptions_total',
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
  create: hasPermission('create_package'),
  edit: hasPermission('update_package'),
  delete: hasPermission('delete_package'),
  changeStatus: hasPermission('change_status_package'),
  sort: hasPermission('sort_package'),
  viewDetails: hasPermission('show_package_details'),
  viewAdvertisers: hasPermission('view_advertisers'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: goToCreatePage,
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
function goToCreatePage(id: number) {
  router.push({ name: 'subscriptions-create-package-page', params: { id } })
}

function goToEditPage(id: number) {
  router.push({ name: 'subscriptions-edit-package-page', params: { id } })
}

function goToDetailsPage(id: number) {
  router.push({ name: 'subscriptions-package-details-page', params: { id } })
}

function rowProps({ item }: { item: SubscriptionsListItem }) {
  return {
    class: item.is_default && 'bg-background',
  }
}
// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <VCard title="باقات الإشتراك" class="page-card">
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
      >
        <div class="v-col-md-4 pa-0">
          <AppSelect
            v-model="params.is_default"
            name="type"
            :items="packagesTypesOptions"
            item-title="label"
            item-value="value"
            label="النوع"
            hide-default-label
            @update:model-value="onReloadData"
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
        :item-selectable="(item) => !item.is_default"
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        :row-props="rowProps"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="38" variant="tonal" class="me-3" cover>
              <VImg v-if="item.image_path" :src="item.image_path" cover />
              <span v-else>!</span>
            </VAvatar>
            <span>
              {{ item.name }}
            </span>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
          </div>
        </template>
        <template #item.subscribers_count="{ item }">
          <div class="text-no-wrap">{{ item.subscribers_count ?? '-' }}</div>
        </template>
        <template #item.subscriptions_total="{ item }">
          <div class="text-no-wrap">{{ item.subscriptions_total ?? '-' }}</div>
        </template>

        <template #item.is_active="{ item }">
          <ToggleActivationSwitch
            :id="item.id"
            v-model="item.is_active"
            :model="MODEL_NAME"
            :disabled="!permissions.changeStatus"
          />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn :disabled="!permissions.delete || item.is_default">
              <VIcon icon="tabler-trash" @click="showConfirmDeleteItem(item)" />
            </IconBtn>

            <IconBtn :disabled="!permissions.edit" @click="goToEditPage(item.id)">
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="goToDetailsPage(item.id)" :disabled="!permissions.viewDetails">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>
                  <VListItem
                    :disabled="!permissions.viewAdvertisers"
                    :to="{ name: 'advertisers-page', query: { packageId: item.id } }"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-user-dollar" />
                    </template>

                    <VListItemTitle>عرض المعلنين</VListItemTitle>
                  </VListItem>

                  <VListItem
                    :disabled="
                      !selectedItems.length || selectedItems.includes(item.id) || !permissions.sort
                    "
                    @click="sortItems(item.id)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-transfer-in" />
                    </template>
                    <VListItemTitle>نقل</VListItemTitle>
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
</template>

<style lang="scss" scoped>
:deep(.search-input) {
  margin: 0 !important;
}

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
