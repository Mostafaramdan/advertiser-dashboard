<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { useAuthStore } from '@/stores/AuthStore'
import type { Tag } from '../interfaces/Tag'
import TagDetailsModal from '../modals/TagDetailsModal.vue'
import TagFormModal from '../modals/TagFormModal.vue'
import { tagsService } from '../services/TagsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variabless
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'tags'
const isLoadingCategories = ref<boolean>(false)
const categoriesList = ref<any>([])

const params = reactive({
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
} = UseCrudHelpers<Tag>(tagsService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'الاسم عربي',
    key: 'name.ar',
  },
  {
    title: 'الاسم انجليزي',
    key: 'name.en',
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
  create: hasPermission('create_tag'),
  edit: hasPermission('update_tag'),
  delete: hasPermission('delete_tag'),
  changeStatus: hasPermission('change_status_tag'),
  sort: hasPermission('sort_tag'),
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
getCategories()
// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function getCategories() {
  isLoadingCategories.value = true
  listService
    .getCategories()
    .then((res: any) => {
      categoriesList.value = res.data.data
    })
    .finally(() => {
      isLoadingCategories.value = false
    })
}

function rowProps({ item }: { item: Tag }) {
  return {
    class: !item.can_control && 'bg-background',
  }
}

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <TagFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @edit-item="onEditItem"
    @create-item="onCreateItem"
  />
  <TagDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="التصنيفات" class="page-card">
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
            v-model="params.category_id"
            name="category_id"
            :items="categoriesList"
            :loading="isLoadingCategories"
            :disabled="isLoadingCategories"
            item-title="label"
            item-value="id"
            label="القسم"
            hide-default-label
            @update:model-value="onReloadData"
            clearable
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
        :item-selectable="(item) => item.can_control"
        class="app-table"
        :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        :row-props="rowProps"
      >
        <template #item.name.ar="{ item }">
          <span>
            {{ item.name.ar }}
          </span>
        </template>
        <template #item.name.en="{ item }">
          <span>
            {{ item.name.en }}
          </span>
        </template>

        <template #item.is_active="{ item }">
          <ToggleActivationSwitch
            :id="item.id"
            v-model="item.is_active"
            :model="MODEL_NAME"
            :disabled="!permissions.changeStatus || !item.can_control"
          />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn
              :disabled="!permissions.delete || !item.can_control"
              @click="showConfirmDeleteItem(item)"
            >
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <IconBtn
              :disabled="!permissions.edit || !item.can_control"
              @click="showEditModal(item)"
            >
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
                    v-if="permissions.sort || !item.can_control"
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

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}

:deep(.search-input) {
  margin: 0 !important;
}
</style>
