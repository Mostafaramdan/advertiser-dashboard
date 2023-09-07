<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { GENDER_TYPES, USERS_ROLES, USERS_TYPES } from '@/constants/index'
import { PAYMENT_STATUSES, REQUEST_STATUSES } from '@/constants/subscriptions'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { SubscriptionsRequestItem } from '../interfaces/SubscriptionsRequests'
import SubscriptionsRequestDetailsModal from '../modals/SubscriptionsRequestDetailsModal.vue'
import SubscriptionsRequestEditModal from '../modals/SubscriptionsRequestEditModal.vue'
import { subscriptionsRequestsService } from '../services/SubscriptionsRequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('../components/SubscriptionsRequestsFilter.vue'),
)
const { t } = useI18n()
const toast = useToast()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'subscription_requests'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)

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
  showViewModal,
  showEditModal,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  onEditItem,
  showConfirmDeleteItem,
} = UseCrudHelpers<SubscriptionsRequestItem>(subscriptionsRequestsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'الاسم/البريد الالكتروني',
    key: 'account_name',
  },
  {
    title: 'وقت الطلب/رقم الجوال',
    key: 'created_at',
  },
  {
    title: 'تاريخ الانتهاء/اسم الباقة',
    key: 'ended_at',
  },
  {
    title: 'حالة الطلب/حالة الدفع',
    key: 'payment_status',
  },
  {
    title: 'نوع المشترك/الجنس',
    key: 'user_type',
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
  sendNotification: hasPermission('notify_users'),
  delete: hasPermission('delete_subscription_request'),
  edit: hasPermission('update_subscription_request'),
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

function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

// #endregion
</script>

<template>
  <section>
    <SubscriptionsRequestEditModal
      v-if="showFormModal"
      v-model:showModal="showFormModal"
      :form-action="FormAction"
      :active-item="activeItem"
      @edit-item="onEditItem"
    />
    <SubscriptionsRequestDetailsModal
      v-model:showModal="showDetailsModal"
      :active-item="activeItem"
    />
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <ConfirmModal ref="confirmModal" />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard class="page-card">
      <template #title> طلبات الاشتراكات {{ metaData && `(${metaData.total})` }} </template>
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :show-multi-delete="permissions.delete"
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
          :item-selectable="(item) => !item.is_deleted"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.account_name="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.raw.user.image" :src="item.raw.user.image" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 205px">
                {{ item.raw.user.account_name }}
                <span class="text-sm text-disabled d-block">{{ item.raw.user.email }}</span>
              </div>
            </div>
          </template>
          <template #item.country_name="{ item }">
            <div style="min-width: 150px">
              {{ item.raw.country_name }}
              <span class="text-sm text-disabled d-block">{{ item.raw.area_name }}</span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.created_at) }}
              <span class="text-sm text-disabled d-block"> {{ item.raw.user.phone }}</span>
            </div>
          </template>
          <template #item.ended_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.ended_at) }}
              <span class="text-sm text-disabled d-block"> {{ item.raw.package_name }}</span>
            </div>
          </template>
          <template #item.payment_status="{ item }">
            <div style="min-width: 100px">
              {{ REQUEST_STATUSES[item.raw.request_status] }}
              <span class="text-sm text-disabled d-block">{{
                PAYMENT_STATUSES[item.raw.payment_status]
              }}</span>
            </div>
          </template>

          <template #item.user_type="{ item }">
            <div style="min-width: 100px">
              {{ USERS_ROLES[item.raw.user.role] + ' ' + USERS_TYPES[item.raw.user.type] }}
              <span class="text-sm text-disabled d-block">{{
                GENDER_TYPES[item.raw.user.gender as 'male' | 'female']
              }}</span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.delete">
                <VIcon icon="tabler-trash" @click="showConfirmDeleteItem(item.raw)" />
              </IconBtn>
              <IconBtn :disabled="!permissions.edit">
                <VIcon icon="tabler-edit" @click="showEditModal(item.raw)" />
              </IconBtn>
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="showViewModal(item.raw)">
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>عرض</VListItemTitle>
                    </VListItem>

                    <VListItem
                      v-if="!item.raw.is_deleted"
                      :disabled="!permissions.delete"
                      @click="showConfirmDeleteItem(item.raw)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>

                      <VListItemTitle>حذف</VListItemTitle>
                    </VListItem>
                    <VListItem
                      v-if="permissions.sendNotification"
                      @click="openNotificationModal(item.raw.user)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>

                      <VListItemTitle>إرسال تنبيه</VListItemTitle>
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

  .v-img__img--contain {
    object-fit: cover;
  }
}
</style>
