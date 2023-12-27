<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import { useAuthStore } from '@/stores/AuthStore'
import LogsStats from '../components/LogsStats.vue'
import type { LogsItem } from '../interfaces/Logs'
import LogsDetailsModal from '../modals/LogsDetailsModal.vue'
import { logsService } from '../services/LogsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { formatDate } = UseGeneralHelpers()
const { hasPermission } = useAuthStore()
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
  showDetailsModal,
  activeItem,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showViewModal,
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
const permissions = computed(() => ({
  viewDetails: hasPermission('view_payment_log_details'),
}))
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
    <LogsDetailsModal
      v-if="showDetailsModal"
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
    />
    <VCard class="page-card" title="سجل العمليات">
      <VCardText>
        <LogsStats />
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
          <template #item.id="{ item }" v-if="permissions.viewDetails">
            <a href="#" @click.prevent="showViewModal(item)">{{ item.id }}</a>
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

:deep(.search-input) {
  margin: 0 !important;
}

:deep(.v-input--horizontal) {
  margin-block-start: 0 !important;
}
</style>
