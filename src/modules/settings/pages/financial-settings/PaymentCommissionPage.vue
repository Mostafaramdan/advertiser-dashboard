<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { PaymentCommission } from '../../interfaces/PaymentCommission'
import PaymentCommissionDetailsModal from '../../modals/PaymentCommissionDetailsModal.vue'
import PaymentCommissionFormModal from '../../modals/PaymentCommissionFormModal.vue'
import { paymentCommissionService } from '../../services/PaymentCommissionService'
import { useAuthStore } from '@/stores/AuthStore'
import type { pageAction } from '@/interfaces/Shared'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'payment_commissions'

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
} = UseCrudHelpers<PaymentCommission>(paymentCommissionService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'الاسم',
    key: 'name',
  },
  {
    title: 'الحد الادنى',
    key: 'minimum',
    align: 'center',
  },
  {
    title: 'الحد الأعلى',
    key: 'maximum',
    align: 'center',
  },
  {
    title: 'نسبة العمولة داخل المنصة',
    key: 'value_in_platform',
    align: 'center',
  },
  {
    title: 'نسبة العمولة خارج المنصة',
    key: 'value_out_platform',
    align: 'center',
  },
  {
    title: 'الحالة',
    key: 'blocked_at',
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
  create: hasPermission('create_payment_commission'),
  edit: hasPermission('update_payment_commission'),
  delete: hasPermission('delete_payment_commission'),
  changeStatus: hasPermission('sort_payment_commission'),
  sort: hasPermission('sort_payment_commission'),
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

  <PaymentCommissionFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
  />
  <PaymentCommissionDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />

  <VCard flat>
    <div class="pt-1">
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
            {{ item.raw.name }}
          </span>
        </template>
        <template #item.value_in_platform="{ item }">
          {{ item.raw.value_in_platform }} %
        </template>
        <template #item.value_out_platform="{ item }">
          {{ item.raw.value_out_platform }} %
        </template>
        <template #item.blocked_at="{ item }">
          <ToggleActivationSwitch
            :id="item.raw.id"
            v-model="item.raw.blocked_at"
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

            <VBtn
              icon
              variant="text"
              size="small"
              color="medium-emphasis"
            >
              <VIcon
                size="24"
                icon="tabler-dots-vertical"
              />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item.raw)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>

                  <VListItem v-if="permissions.sort" :disabled="!selectedItems.length || selectedItems.includes(item.raw.id)" @click="sortItems(item.raw.id)">
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
