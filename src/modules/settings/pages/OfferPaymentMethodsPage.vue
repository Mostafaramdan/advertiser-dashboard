<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { OFFER_PAYMENT_METHODS } from '@/constants/settings'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { OfferPaymentMethod } from '../interfaces/OfferPaymentMethod'
import OfferPaymentMethodDetailsModal from '../modals/OfferPaymentMethodDetailsModal.vue'
import OfferPaymentMethodFormModal from '../modals/OfferPaymentMethodFormModal.vue'
import { offerPaymentMethodsService } from '../services/OfferPaymentMethodsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'offer_payment_methods'

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
} = UseCrudHelpers<OfferPaymentMethod>(offerPaymentMethodsService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'نسبة المقدم',
    key: 'down_payment_percentage',
  },
  {
    title: 'تسليم المقدم',
    key: 'down_payment_delivering',
  },
  {
    title: 'تسليم الباقي',
    key: 'remaining_payment_delivering',
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
  create: hasPermission('create_offer_payment_method'),
  edit: hasPermission('update_offer_payment_method'),
  delete: hasPermission('delete_offer_payment_method'),
  changeStatus: hasPermission('change_status_offer_payment_method'),
  sort: hasPermission('sort_offer_payment_method'),
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
// getPageData()
tableData.value = [
  {
    id: 1,
    sort: 1,
    is_active: true,
    down_payment_percentage: 20,
    down_payment_delivering: 'in_advance_direct_to_merchant',
    remaining_payment_delivering: 'in_advance_by_platform',
  },
]

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <OfferPaymentMethodFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
  />
  <OfferPaymentMethodDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="طرق دفع العرض" class="page-card">
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
        <template #item.down_payment_percentage="{ item }">
          <div class="text-no-wrap">{{ item.down_payment_percentage }} %</div>
        </template>
        <template #item.down_payment_delivering="{ item }">
          <span style="min-inline-size: 150px">
            {{
              OFFER_PAYMENT_METHODS[
                item.down_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS
              ]
            }}
          </span>
        </template>
        <template #item.remaining_payment_delivering="{ item }">
          <span style="min-inline-size: 150px">
            {{
              OFFER_PAYMENT_METHODS[
                item.remaining_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS
              ]
            }}
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

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
