<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { BudgetSlide } from '../interfaces/BudgetSlide'
import BudgetSlideDetailsModal from '../modals/BudgetSlideDetailsModal.vue'
import BudgetSlideFormModal from '../modals/BudgetSlideFormModal.vue'
import { budgetSlidesService } from '../services/BudgetSlidesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'budget_slides'

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
} = UseCrudHelpers<BudgetSlide>(budgetSlidesService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'من',
    key: 'from',
  },
  {
    title: 'الي',
    key: 'to',
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
  create: hasPermission('create_budget_slides'),
  edit: hasPermission('update_budget_slides'),
  delete: hasPermission('delete_budget_slides'),
  changeStatus: hasPermission('change_status_budget_slides'),
  sort: hasPermission('sort_budget_slides'),
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
  <BudgetSlideFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @edit-item="onEditItem"
    @create-item="onCreateItem"
  />
  <BudgetSlideDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="شرائح الميزانية" class="page-card">
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
        <template #item.from="{ item }">
          <div style="min-inline-size: 70px" class="text-no-wrap">
            {{ item.from }}
          </div>
        </template>
        <template #item.to="{ item }">
          <div style="min-inline-size: 70px" class="text-no-wrap">
            {{ item.to }}
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
            <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <IconBtn :disabled="!permissions.edit" @click="showEditModal(item)">
              <VIcon icon="tabler-edit" />
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
