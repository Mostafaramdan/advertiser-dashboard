<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import { pageAction } from '@/interfaces/Shared'
import type { ExchangeRecord } from '../interfaces/ExchangeRecord'
import ExchangeRecordCreateModal from '../modals/ExchangeRecordCreateModal.vue'
import ExchangeRecordDetailsModal from '../modals/ExchangeRecordDetailsModal.vue'
import { exchangeRecordsService } from '../services/ExchangeRecordsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDate } = UseGeneralHelpers()
const showCreateModal = ref<boolean>(false)
const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const {
  tableData,
  metaData,
  IsLoadingData,
  showDetailsModal,
  activeItem,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showViewModal,
} = UseCrudHelpers<ExchangeRecord>(exchangeRecordsService, params, '')

const headers: any = [
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'تاريخ العملية',
    key: 'created_at',
  },
  {
    title: 'مبلغ الصرف',
    key: 'total',
  },
  {
    title: 'حساب الصرف',
    key: 'card.label',
  },
  {
    title: 'قناة الصرف',
    key: 'card.type',
  },
  {
    title: 'النوع',
    key: 'type',
  },
  {
    title: 'حالة الاستلام',
    key: 'status',
    align: 'center',
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
const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: true,
      handler: openCreateModal,
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
function openCreateModal() {
  showCreateModal.value = true
}
// #endregion
</script>

<template>
  <section>
    <ExchangeRecordDetailsModal
      v-if="showDetailsModal"
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
    />
    <ExchangeRecordCreateModal
      v-if="showCreateModal"
      v-model:showModal="showCreateModal"
      @create-item="onReloadData"
    />
    <VCard class="page-card" title="سجل الصرف">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        >
          <div class="v-col-md-4 pa-0">
            <UsersSelectFilter
              id="users-select-filter"
              label="المستخدم"
              :userRole="null"
              v-model="params.user_id"
              hide-default-label
              @update:model-value="onReloadData"
              clearable
            />
          </div>
          <span class="me-auto" />
        </PageActions>
        <VDataTableServer
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.user="{ item }">
            <div style="min-inline-size: 200px">
              {{ item.user.username }}
              <span class="text-sm text-disabled d-block">{{ USERS_ROLES[item.user.role] }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">{{ formatDate(item.created_at) }}</div>
          </template>
          <template #item.total="{ item }">
            <div class="text-no-wrap">{{ item.total }} {{ item.currency }}</div>
          </template>
          <template #item.card.label="{ item }">
            <div style="min-inline-size: 100px">
              <span>{{ item.card.label }}</span>
            </div>
          </template>
          <template #item.card.type="{ item }">
            <div style="min-inline-size: 100px">
              <span>{{ item.card.type }}</span>
            </div>
          </template>
          <template #item.type="{ item }">
            <div style="min-inline-size: 100px">
              <span>{{ item.type }}</span>
            </div>
          </template>
          <template #item.status="{ item }">
            <VChip color="dark">
              {{ item.status }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn @click="showViewModal(item)">
                <VIcon icon="tabler-eye" />
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
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 200px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}

:deep(.search-input) {
  margin: 0 !important;
}

:deep(.v-input--horizontal) {
  margin-block-start: 0 !important;
}
</style>
