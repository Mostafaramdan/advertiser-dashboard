<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { ViewsPrice } from '../interfaces/ViewsPrice'
import ViewsPriceDetailsModal from '../modals/ViewsPriceDetailsModal.vue'
import ViewsPriceFormModal from '../modals/ViewsPriceFormModal.vue'
import { viewsPricesService } from '../services/ViewsPricesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'prices'

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  showFormModal,
  showDetailsModal,
  FormAction,
  activeItem,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showCrateModal,
  showEditModal,
  showViewModal,
  onEditItem,
  onCreateItem,
  showConfirmDeleteItem,
  sortItems,
} = UseCrudHelpers<ViewsPrice>(viewsPricesService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'قيمة السعر',
    key: 'price',
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
  create: hasPermission('create_views_price'),
  edit: hasPermission('update_views_price'),
  delete: hasPermission('delete_views_price'),
  changeStatus: hasPermission('change_status_views_price'),
  sort: hasPermission('sort_views_price'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: showCrateModal,
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
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <ViewsPriceFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
  />
  <ViewsPriceDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="أسعار المشاهدات" class="page-card">
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
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.price="{ item }">
          <div class="text-no-wrap">
            {{ item.price }}
          </div>
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
            <IconBtn :disabled="!permissions.delete">
              <VIcon icon="tabler-trash" @click="showConfirmDeleteItem(item)" />
            </IconBtn>

            <IconBtn :disabled="!permissions.edit">
              <VIcon icon="tabler-edit" @click="showEditModal(item)" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>

                  <VListItem
                    v-if="permissions.sort"
                    :disabled="!selectedItems.length || selectedItems.includes(item.id)"
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
