<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import type { pageAction } from '@/interfaces/Shared'
import { sharedService } from '@/services/SharedService'
import { useAuthStore } from '@/stores/AuthStore'
import { useDisputesStore } from '@/stores/DisputesStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import RequestsStats from '../components/RequestsStats.vue'
import type { DisputeRequest, User } from '../interfaces/DisputeRequest'
import RequestProcedureModal from '../modals/RequestProcedureModal.vue'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('../components/RequestsFilter.vue'))
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const disputesStore = useDisputesStore()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'disputes'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showProcedureModal = ref<boolean>(false)
const activeItem = ref<DisputeRequest | null>(null)
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
} = UseCrudHelpers<DisputeRequest>(requestsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'مقدم الطلب',
    key: 'disputer',
  },
  {
    title: 'طرف العلاقة',
    key: 'disputed',
  },
  {
    title: 'نوع طلب التنازع/حالة التنازع',
    key: 'request_type',
  },
  {
    title: 'تاريخ التنازع/تاريخ أخر تعديل',
    key: 'created_at',
  },
  {
    title: 'رقم طلب الاعلان/رقم طلب التنازع',
    key: 'ads_request_id',
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
  takeProcedure: hasPermission('make_procedure_dispute'),
  viewRequestDetails: hasPermission('view_dispute_details'),
  viewAdsRequestDetails: hasPermission('view_ads_requests_details'),
}))

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
// reset admins list
disputesStore.setProceduresList([])
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function goToUserProfile(user: User) {
  router.push({
    name: user.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
    params: { id: user.id },
    query: { tab: 'details' },
  })
}

function openProcedureModal(item: DisputeRequest) {
  activeItem.value = item
  showProcedureModal.value = true
}

function toggleFavorite(item: DisputeRequest) {
  IsLoadingData.value = true
  item.is_starred = !item.is_starred
  const payload: any = {
    id: item.id,
    model: MODEL_NAME,
    column: 'is_starred',
  }
  sharedService
    .toggleActivation(payload)
    .then((res) => {
      toast.success(res.data.message)
      onReloadData()
    })
    .catch(() => {
      item.is_starred = !item.is_starred
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

function onTakeProcedure(item: DisputeRequest) {
  // replace the item in data table with the new one
  const targetIndex = tableData.value.findIndex((request: DisputeRequest) => request.id === item.id)
  if (targetIndex !== -1) tableData.value.splice(targetIndex, 1, item)
}

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
    <RequestProcedureModal
      :request-id="activeItem.id"
      v-if="showProcedureModal && activeItem"
      v-model:showModal="showProcedureModal"
      @procedure:sent="onTakeProcedure"
    />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard title="طلبات التنازع" class="page-card">
      <VCardText>
        <RequestsStats />
        <PageActions
          :page-actions-buttons="pageActionsButtons"
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
          <template #item.disputer="{ item }">
            <a
              href="#"
              @click.prevent="goToUserProfile(item.raw.disputer)"
              style="min-width: 205px"
            >
              <span>{{ item.raw.disputer.username }}</span>
              <span class="text-sm text-disabled d-block">{{
                USERS_ROLES[item.raw.disputer.role]
              }}</span>
            </a>
          </template>
          <template #item.disputed="{ item }">
            <a
              href="#"
              @click.prevent="goToUserProfile(item.raw.disputed)"
              style="min-width: 205px"
            >
              <span>{{ item.raw.disputed.username }}</span>
              <span class="text-sm text-disabled d-block">{{
                USERS_ROLES[item.raw.disputed.role]
              }}</span>
            </a>
          </template>

          <template #item.request_type="{ item }">
            <div style="min-width: 150px">
              <span>{{ item.raw.request_type || '-' }}</span>
              <span class="text-sm text-disabled d-block"> {{ item.raw.dispute_status }}</span>
            </div>
          </template>

          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.created_at) }}
              <span class="text-sm text-disabled d-block">
                {{ formatDateTime(item.raw.updated_at) }}</span
              >
            </div>
          </template>

          <template #item.ads_request_id="{ item }">
            <div style="min-width: 100px">
              <router-link
                class="pa-1"
                v-if="permissions.viewAdsRequestDetails"
                :to="{
                  name: 'ads-request-details-page',
                  params: { id: item.raw.ads_request_id },
                  query: { tab: 'details' },
                }"
                >{{ item.raw.ads_request_id }}</router-link
              >
              <span class="pa-1" v-else>{{ item.raw.ads_request_id }}</span>
            </div>
            <span class="text-sm text-disabled d-block pa-1"> {{ item.raw.id }}</span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.viewRequestDetails">
                <VIcon icon="tabler-eye" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="toggleFavorite(item.raw)">
                      <template #prepend>
                        <VIcon
                          icon="tabler-star-filled"
                          :color="item.raw.is_starred ? '#ffcc00' : 'dark'"
                        />
                      </template>

                      <VListItemTitle>اضافة للمفضلة</VListItemTitle>
                    </VListItem>

                    <VListItem
                      :disabled="!permissions.takeProcedure || !item.raw.can_make_procedure"
                      @click="openProcedureModal(item.raw)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-status-change" />
                      </template>
                      <VListItemTitle>اتخاذ اجراء</VListItemTitle>
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
