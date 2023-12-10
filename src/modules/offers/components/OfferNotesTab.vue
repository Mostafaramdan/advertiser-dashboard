<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { OfferNotesItem } from '../interfaces/Offer'
import { offersService } from '../services/OffersService'
import OfferNoteDetailsModal from './OfferNoteDetailsModal.vue'
import OfferNoteFormModal from './OfferNoteFormModal.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'offer_notes'
const offerId = +route.params.id
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
} = UseCrudHelpers<OfferNotesItem>(null, params, MODEL_NAME)

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
  create: hasPermission('create_offer_note'),
  edit: hasPermission('update_offer_note'),
  delete: hasPermission('delete_offer_note'),
  sort: hasPermission('sort_entity'),
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
  offersService
    .getOfferNotes(offerId, params)
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
function deleteItem(item: OfferNotesItem): void {
  deleteItemFromSelectedItems(item)

  IsLoadingData.value = true
  offersService
    .deleteOfferNote({ offerId, noteId: item.id })
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
 * @param  {ItemType} item
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
    <div>
      <ConfirmModal ref="confirmModal" />
      <OfferNoteFormModal
        v-if="showFormModal"
        v-model:showModal="showFormModal"
        :form-action="FormAction"
        :active-item="activeItem"
        @create-item="reloadPageData"
        @edit-item="onEditItem"
        :offer-id="offerId"
      />
      <OfferNoteDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
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
          <router-link :to="{ name: 'employees-details-page', params: { id: item.admin.id } }">
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
