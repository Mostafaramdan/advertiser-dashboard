<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { ProductNotesItem } from '../interfaces/Offer'
import ProductNoteDetailsModal from '../modals/ProductNoteDetailsModal.vue'
import ProductNoteFormModal from '../modals/ProductNoteFormModal.vue'
import { productsService } from '../services/ProductsService'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; productId: number }>(), {
  showModal: false,
})
// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const MODEL_NAME = 'product_notes'
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  showDetailsModal,
  confirmModal,
  activeItem,
  IsLoadingData,
  FormAction,
  showFormModal,
  deleteItemFromTableData,
  deleteItemFromSelectedItems,
  showCrateModal,
  showEditModal,
  showViewModal,
  onEditItem,
} = UseCrudHelpers<ProductNotesItem>(null, params, MODEL_NAME)

const headers: any = [
  {
    title: 'اسم المسؤول',
    key: 'admin',
  },
  {
    title: 'التاريخ',
    key: 'created_at',
  },
  {
    title: 'الوصف',
    key: 'note',
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
  create: hasPermission('create_product_note'),
  edit: hasPermission('update_product_note'),
  delete: hasPermission('delete_product_note'),
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

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData(): void {
  IsLoadingData.value = true
  productsService
    .getNotes(props.productId, params)
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

/**
 * @description reload page data
 * @return  {void}
 */
function reloadPageData(): void {
  params.page = 1
  getPageData()
}

/**
 * @description update search keyword and reload page data
 * @param  {string} value
 * @return  {void}
 */
function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

/**
 * @description update items per page and reload page data
 * @param  {number} value
 * @return  {void}
 */
function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

/**
 * @description reload page data and reset selected items
 */
function onReloadData(): void {
  reloadPageData()
  selectedItems.value = []
}

/**
 * @description delete item from server
 * @param  {any} item
 * @return  {void}
 */
function deleteItem(item: ProductNotesItem): void {
  deleteItemFromSelectedItems(item)

  IsLoadingData.value = true
  productsService
    .deleteNote({ productId: props.productId, noteId: item.id })
    .then((res: any) => {
      toast.success(res.data.message)
      deleteItemFromTableData(item)
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

/**
 * @description show confirm modal before delete item
 * @param  {ProductNotesItem} item
 * @return  {Promise<void>}
 */
async function showConfirmDeleteItem(item: any): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteItem(item)
}
// #endregion
</script>

<template>
  <section>
    <VDialog
      v-model="showModal"
      fullscreen
      :scrim="false"
      scrollable
      transition="dialog-bottom-transition"
    >
      <!-- Dialog Content -->
      <VCard>
        <div>
          <!-- Toolbar -->
          <VToolbar
            density="compact"
            title="سجل التوصيات"
            style="position: sticky; z-index: 1; inline-size: 100%; inset-block-start: 0"
            elevation="2"
            color="grey-200"
          >
            <VBtn icon @click="showModal = false" color="dark" size="40">
              <VIcon icon="tabler-x" size="24" />
            </VBtn>
          </VToolbar>

          <!-- tabs -->
          <VCardText class="pa-4">
            <div>
              <ConfirmModal ref="confirmModal" />
              <ProductNoteFormModal
                v-if="showFormModal"
                v-model:showModal="showFormModal"
                :form-action="FormAction"
                :active-item="activeItem"
                @create-item="reloadPageData"
                @edit-item="onEditItem"
                :product-id="productId"
              />
              <ProductNoteDetailsModal
                v-model:showModal="showDetailsModal"
                :active-item="activeItem"
              />
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
                class="app-table"
                :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
              >
                <template #item.admin="{ item }">
                  <router-link
                    :to="{ name: 'employees-details-page', params: { id: item.admin.id } }"
                  >
                    <span>{{ item.admin.username }}</span>
                  </router-link>
                </template>
                <template #item.created_at="{ item }">
                  <div class="text-no-wrap">
                    {{ formatDateTime(item.created_at) }}
                  </div>
                </template>
                <template #item.note="{ item }">
                  <span style="min-inline-size: 150px">
                    {{ item.note || '-' }}
                  </span>
                </template>
                <template #item.actions="{ item }">
                  <div class="d-flex justify-center">
                    <IconBtn @click="showViewModal(item)">
                      <VIcon icon="tabler-eye" />
                    </IconBtn>

                    <IconBtn :disabled="!permissions.edit" @click="showEditModal(item)">
                      <VIcon icon="tabler-edit" />
                    </IconBtn>

                    <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
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
          </VCardText>
        </div>
      </VCard>
    </VDialog>
  </section>
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
