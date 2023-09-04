<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { TermsConditionsItem } from '../interfaces/TermsConditionsItem'
import TermsConditionsDetailsModal from '../modals/TermsConditionsDetailsModal.vue'
import TermsConditionsFormModal from '../modals/TermsConditionsFormModal.vue'
import { termsConditionsService } from '../services/TermsConditionsService'
import { useAuthStore } from '@/stores/AuthStore'
import { listService } from '@/services/ListService'
import type { pageAction } from '@/interfaces/Shared'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'terms'

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  type: ['support'],
})

const isLoading = reactive({
  types: false,
})

const termsConditionsTypes = ref<{ label: string; id: string }[]>([
  {
    id: 'support',
    label: 'شروط واحكام عامة',
  },
])

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
} = UseCrudHelpers<TermsConditionsItem>(termsConditionsService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'العنوان',
    key: 'name',
  },
  {
    title: 'النوع',
    key: 'type',
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
  create: hasPermission('create_term'),
  edit: hasPermission('update_term'),
  delete: hasPermission('delete_term'),
  changeStatus: hasPermission('change_status_term'),
  sort: hasPermission('sort_term'),
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
getTermsConditionsTypes()
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getTermsConditionsTypes() {
  isLoading.types = true
  listService
    .getTermsConditionsTypes()
    .then((res) => {
      termsConditionsTypes.value = res.data
    })
    .finally(() => {
      isLoading.types = false
    })
}

function handleOnEditItem(item: TermsConditionsItem) {
  if (params.type.includes(item.type.id)) {
    onEditItem(item)
  } else {
    params.type.push(item.type.id)
    getPageData()
  }
}

function handleCreateItem(item: any) {
  if (!params.type.includes(item.data?.type?.id)) params.type.push(item.type)

  onCreateItem(item)
}

// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <TermsConditionsFormModal
      v-if="showFormModal"
      v-model:showModal="showFormModal"
      :form-action="FormAction"
      :active-item="activeItem"
      :terms-conditions-types="termsConditionsTypes"
      @edit-item="handleOnEditItem"
      @create-item="handleCreateItem"
    />
    <TermsConditionsDetailsModal
      v-if="showDetailsModal"
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
    />
    <VCard title="الشروط والاحكام" class="page-card">
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
              v-model="params.type"
              multiple
              name="type"
              :items="termsConditionsTypes"
              item-title="label"
              item-value="id"
              label="النوع"
              hide-default-label
              :loading="isLoading.types"
              :disabled="isLoading.types"
              @update:model-value="onReloadData"
            >
              <template #selection="{ item, index }">
                <VChip v-if="index < 1">
                  <span>{{ item.title }}</span>
                </VChip>
                <span v-if="index === 1" class="text-grey text-caption align-self-center">
                  (+{{ params.type.length - 1 }} اخري)
                </span>
              </template>
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
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.name="{ item }">
            <span style="min-width: 200px">
              {{ item.raw.name }}
            </span>
          </template>

          <template #item.type="{ item }">
            <span style="min-width: 150px">
              {{ item.raw.type.label }}
            </span>
          </template>

          <template #item.is_active="{ item }">
            <ToggleActivationSwitch
              :id="item.raw.id"
              v-model="item.raw.is_active"
              :model="MODEL_NAME"
              :disabled="!permissions.changeStatus"
            />
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.delete">
                <VIcon icon="tabler-trash" @click="showConfirmDeleteItem(item.raw)" />
              </IconBtn>

              <IconBtn :disabled="!permissions.edit">
                <VIcon icon="tabler-edit" @click="showEditModal(item.raw)" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="showViewModal(item.raw)">
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>عرض</VListItemTitle>
                    </VListItem>

                    <VListItem
                      v-if="permissions.sort"
                      :disabled="!selectedItems.length || selectedItems.includes(item.raw.id)"
                      @click="sortItems(item.raw.id)"
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
  </section>
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
