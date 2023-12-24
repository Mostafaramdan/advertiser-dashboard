<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import type { PointsLogsItem } from '../interfaces/PointsLogs'
import { pointsLogsService } from '../services/PointsLogsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { formatDate } = UseGeneralHelpers()
const userKeyword = ref<string>('')
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
} = UseCrudHelpers<PointsLogsItem>(pointsLogsService, params, '')

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
    title: 'تاريخ العملية/تاريخ انتهاء الصلاحية',
    key: 'created_at',
  },
  {
    title: 'عدد النقاط/المبلغ',
    key: 'points',
  },
  {
    title: 'البيان',
    key: 'action_name',
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
checkQueryParams()
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function checkQueryParams() {
  const { user_id, username } = route.query
  if (user_id) params.user_id = +user_id
  if (username) userKeyword.value = username as string
}
// #endregion
</script>

<template>
  <section>
    <VCard class="page-card" title="سجل النقاط">
      <VCardText>
        <PageActions
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
              :keyword="userKeyword"
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
            <div class="text-no-wrap" style="min-inline-size: 100px">
              {{ formatDate(item.created_at) }}
              <span class="text-sm text-disabled d-block">{{
                formatDate(item.points_ended_at)
              }}</span>
            </div>
          </template>
          <template #item.points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              <span>{{ item.points }}</span>
              <span class="text-sm text-disabled d-block">{{ item.total }}</span>
            </div>
          </template>
          <template #item.action_name="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.action_name }}</span>
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
