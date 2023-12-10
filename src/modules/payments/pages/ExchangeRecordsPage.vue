<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { ExchangeRecord } from '../interfaces/ExchangeRecord'
import { exchangeRecordsService } from '../services/ExchangeRecordsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDate } = UseGeneralHelpers()

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  tableData,
  metaData,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
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
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion
</script>

<template>
  <section>
    <VCard class="page-card" title="سجل الصرف">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.id="{ item }">
            <a href="#">{{ item.id }}</a>
          </template>
          <template #item.user="{ item }">
            <div style="min-inline-size: 200px">
              <span> {{ item.user.username }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">{{ formatDate(item.created_at) }}</div>
          </template>
          <template #item.total="{ item }">
            <div class="text-no-wrap">{{ item.total }} {{ item.currency }}</div>
          </template>
          <template #item.card.label="{ item }">
            <span class="d-block" style="min-inline-size: 100px">{{ item.card.label }}</span>
          </template>
          <template #item.card.type="{ item }">
            <span class="d-block" style="min-inline-size: 100px">{{ item.card.type }}</span>
          </template>
          <template #item.type="{ item }">
            <span class="d-block" style="min-inline-size: 100px">{{ item.type }}</span>
          </template>
          <template #item.status="{ item }">
            <VChip color="dark">
              {{ item.status }}
            </VChip>
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
</style>
