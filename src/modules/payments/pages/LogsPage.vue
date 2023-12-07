<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import LogsStats from '../components/LogsStats.vue'
import type { LogsItem } from '../interfaces/Logs'
import { logsService } from '../services/LogsService'

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
  user_id: null,
})

const {
  tableData,
  metaData,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
} = UseCrudHelpers<LogsItem>(logsService, params, '')

const headers: any = [
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'صاحب العلاقة/النوع',
    key: 'user',
  },
  {
    title: 'الطرف الأخر',
    key: 'other_user',
  },
  {
    title: 'طريقة الدفع/التاريخ',
    key: 'payment_type',
  },
  {
    title: 'نوع العملية/بيان العملية',
    key: 'type',
  },
  {
    title: 'المبلغ/عمولة المنصة',
    key: 'total',
  },
  {
    title: 'عدد النقاط/قيمة النقاط',
    key: 'points',
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
    <VCard class="page-card" title="سجل العمليات">
      <VCardText>
        <LogsStats />
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
              {{ item.user.username }}
              <span class="text-sm text-disabled d-block">{{ USERS_ROLES[item.user.role] }}</span>
            </div>
          </template>
          <template #item.other_user="{ item }">
            <div style="min-inline-size: 200px">
              {{ item.other_user.username }}
              <span class="text-sm text-disabled d-block">{{
                USERS_ROLES[item.other_user.role]
              }}</span>
            </div>
          </template>
          <template #item.payment_type="{ item }">
            <div class="text-no-wrap">
              {{ item.payment_type }}
              <span class="text-sm text-disabled d-block">{{ formatDate(item.created_at) }}</span>
            </div>
          </template>
          <template #item.type="{ item }">
            <div style="min-inline-size: 100px">
              {{ item.type }}
              <span class="text-sm text-disabled d-block">{{ item.operation_type }}</span>
            </div>
          </template>
          <template #item.total="{ item }">
            <div style="min-inline-size: 100px">
              {{ item.total }}
              <span class="text-sm text-disabled d-block">{{ item.commission }}</span>
            </div>
          </template>
          <template #item.points="{ item }">
            <div style="min-inline-size: 100px">
              {{ item.points || '-' }}
              <span class="text-sm text-disabled d-block">{{ item.points_balance || '-' }}</span>
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
}
</style>
