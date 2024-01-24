<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { Question } from '../interfaces/Question'
import QuestionDetailsModal from '../modals/QuestionDetailsModal.vue'
import QuestionFormModal from '../modals/QuestionFormModal.vue'
import { questionsService } from '../services/QuestionsService'
import QuestionsCategoriesSelect from './QuestionsCategoriesSelect.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'questions'

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  category_id: null,
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
} = UseCrudHelpers<Question>(questionsService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'السؤال',
    key: 'question',
  },
  {
    title: 'القسم',
    key: 'category',
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
  create: hasPermission('betrend_create_question'),
  edit: hasPermission('betrend_update_question'),
  delete: hasPermission('betrend_delete_question'),
  changeStatus: hasPermission('betrend_change_status_question'),
  sort: hasPermission('betrend_sort_question'),
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
    <QuestionFormModal
      v-if="showFormModal"
      v-model:showModal="showFormModal"
      :form-action="FormAction"
      :active-item="activeItem"
      @edit-item="onEditItem"
      @create-item="onCreateItem"
    />
    <QuestionDetailsModal
      v-if="showDetailsModal"
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
    />
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
        <QuestionsCategoriesSelect
          v-model="params.category_id"
          hide-default-label
          @update:model-value="onReloadData"
        />
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
      class="app-table"
      :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
    >
      <template #item.question="{ item }">
        <span style="min-inline-size: 200px">
          {{ item.question }}
        </span>
      </template>
      <template #item.category="{ item }">
        <span style="min-inline-size: 150px">
          {{ item.category?.name }}
        </span>
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-select__selection-text) {
  @include max-lines(1);
}

:deep(.search-input) {
  margin: 0 !important;
}

:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
