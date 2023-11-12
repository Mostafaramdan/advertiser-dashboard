<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_TYPES } from '@/constants/settings'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

import type { QuestionCategory } from '../interfaces/QuestionCategory'
import QuestionCategoryDetailsModal from '../modals/QuestionCategoryDetailsModal.vue'
import QuestionCategoryFormModal from '../modals/QuestionCategoryFormModal.vue'
import { questionsCategoriesService } from '../services/QuestionsCategoriesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'support_categories'

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
} = UseCrudHelpers<QuestionCategory>(questionsCategoriesService, params, MODEL_NAME)

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
    title: 'نوع المستخدمين',
    key: 'for',
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
  create: hasPermission('create_support_category'),
  edit: hasPermission('update_support_category'),
  delete: hasPermission('delete_support_category'),
  changeStatus: hasPermission('change_status_support_category'),
  sort: hasPermission('sort_support_category'),
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
  <div>
    <ConfirmModal ref="confirmModal" />
    <QuestionCategoryFormModal
      v-if="showFormModal"
      v-model:showModal="showFormModal"
      :form-action="FormAction"
      :active-item="activeItem"
      @edit-item="onEditItem"
      @create-item="onCreateItem"
    />
    <QuestionCategoryDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
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
      <template #item.name="{ item }">
        <span>
          {{ item.name }}
        </span>
      </template>

      <template #item.for="{ item }">
        <div class="d-flex gap-2">
          <VChip
            v-for="type in item.for as unknown"
            :key="type"
            variant="outlined"
            color="primary"
            label
          >
            {{ USERS_TYPES[type] }}
          </VChip>
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
  </div>
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
