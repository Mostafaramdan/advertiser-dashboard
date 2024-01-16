<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { pageAction } from '@/interfaces/Shared'
// import SupportTicketsStats from '@/modules/tickets/components/SupportTicketsStats.vue'
import { ReminderRequest } from '../interfaces/ReminderRequest'
import { remindersRequestsService } from '../services/RemindersRequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('@/modules/tickets/components/SupportTicketsFilter.vue'),
)
const { t } = useI18n()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'remind_requests'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const params = reactive({
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
} = UseCrudHelpers<ReminderRequest>(remindersRequestsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'مقدم التذكرة',
    key: 'user',
  },
  {
    title: 'نوع التذكرة/رقم التذكرة',
    key: 'support_type',
  },
  {
    title: 'الحالة/تقييم العميل',
    key: 'status',
  },
  {
    title: 'تاريخ الانشاء/تاريخ أخر تعديل',
    key: 'created_at',
  },
  {
    title: 'المسؤول الاول/التوقيت',
    key: 'primary_admin',
  },
  {
    title: 'المسؤول الثاني/التوقيت',
    key: 'secondary_admin',
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
      icon: 'tabler-filter',
      show: true,
      handler: handleShowFilter,
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
function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}

// #endregion
</script>

<template>
  <section>
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard class="page-card" title="طلبات التنبية">
      <VCardText>
        <!-- <SupportTicketsStats /> -->
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :model="MODEL_NAME"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <!-- <VDataTableServer
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          show-select
          :items-length="metaData?.total || 0"
          item-value="id"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.user="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.user.account_name }}</span>
              <span class="text-sm text-disabled d-block">{{ USERS_TYPES[item.user.role] }}</span>
            </div>
          </template>

          <template #item.support_type="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.support_type }}</span>
              <span class="text-sm text-disabled d-block"> {{ item.id }}</span>
            </div>
          </template>

          <template #item.status="{ item }">
            <div style="min-inline-size: 80px">
              <span>{{ TICKETS_STATUSES.get(item.status)?.label }}</span>
              <span class="d-flex align-center text-sm" v-if="item.rate !== null">
                <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                {{ item.rate }}
              </span>
              <span v-else class="text-sm text-disabled d-block"> لا يوجد</span>
            </div>
          </template>

          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.created_at) }}
              <span class="text-sm text-disabled d-block">
                {{ formatDateTime(item.last_update) }}</span
              >
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn @click="() => console.log(item)">
                <VIcon icon="tabler-eye" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>حذف</VListItemTitle>
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
        </VDataTableServer> -->
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper) {
  > table td,
  > table th {
    padding-inline: 8px;
  }
}

:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 200px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
