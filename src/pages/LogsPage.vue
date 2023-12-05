<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseNotificationsHelpers } from '@/composables/UseNotificationsHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { DashboardNotification } from '@/interfaces/Notifications'
import { logsService } from '@/services/LogsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDateTime } = UseGeneralHelpers()
const { handleNotificationAction } = UseNotificationsHelpers()
const MODEL_NAME = 'logs'

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
} = UseCrudHelpers<DashboardNotification>(logsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'العملية',
    key: 'title',
  },
  {
    title: 'الوصف',
    key: 'body',
  },
  {
    title: 'القائم بالعملية',
    key: 'action_by',
  },
  {
    title: 'تاريخ العملية',
    key: 'created_at',
  },
]

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
    <VCard title="سجل العمليات" class="page-card">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          :model="MODEL_NAME"
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
          <template #item.body="{ item }">
            <div class="bg-background pa-2 my-2 rounded text-center" style="inline-size: 300px">
              {{ item.body }}
            </div>
          </template>
          <template #item.title="{ item }">
            <a href="#" @click.prevent="handleNotificationAction(item)" style="inline-size: 150px">
              {{ item.title }}
            </a>
          </template>
          <template #item.action_by="{ item }">
            <div style="inline-size: 180px" v-if="item.action_by">
              {{ item.action_by.username }}
            </div>
            <span v-else>-</span>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.created_at) }}
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
  font-size: 14px;
  word-break: break-word;
}
</style>
