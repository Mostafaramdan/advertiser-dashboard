<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { REMINDER_REQUEST_TYPES } from '@/constants/offers'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import ReminderRequestsStats from '../components/ReminderRequestsStats.vue'
import { ReminderRequest, User } from '../interfaces/ReminderRequest'
import ReminderRequestDetailsModal from '../modals/ReminderRequestDetailsModal.vue'
import { remindersRequestsService } from '../services/RemindersRequestsService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(
  () => import('../components/ReminderRequestsFilter.vue'),
)
const { t } = useI18n()
const toast = useToast()
const { formatDateTime } = UseGeneralHelpers()
const { hasPermission } = useAuthStore()
const activeUser = ref<User | null>(null)
const MODEL_NAME = 'remind_requests'
const showNotificationModal = ref<boolean>(false)
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
  showDetailsModal,
  activeItem,
  showViewModal,
} = UseCrudHelpers<ReminderRequest>(remindersRequestsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'صاحب الطلب/نوع الطلب',
    key: 'user',
  },
  {
    title: 'رقم الجوال/البريد الالكتروني',
    key: 'phone',
  },
  {
    title: 'اسم المنتج/رقم المنتج',
    key: 'product',
  },
  {
    title: 'الكمية من/الكمية الي',
    key: 'from_quantity',
  },
  {
    title: 'تاريخ الطلب/تاريخ عرض المنتج',
    key: 'created_at',
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

function openNotificationModal(user: User) {
  activeUser.value = user
  showNotificationModal.value = true
}

function archiveItem(item: ReminderRequest) {
  IsLoadingData.value = true
  remindersRequestsService
    .toggleArchived(item.id, item.type)
    .then((res) => {
      item.is_archived = !item.is_archived
      toast.success(res.data.message)
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

// #endregion
</script>

<template>
  <section>
    <ReminderRequestDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard class="page-card" title="طلبات التنبية">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :model="MODEL_NAME"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <ReminderRequestsStats :params="params" />
        <VDataTableServer
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.user="{ item }">
            <router-link
              :to="{
                name:
                  item.user.role === 'advertiser'
                    ? 'advertisers-profile-page'
                    : 'user-profile-page',
                params: { id: item.user.id },
                query: { tab: 'details' },
              }"
              class="d-flex align-center"
            >
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <VChip
                  class="px-1 mt-1"
                  :color="item.is_archived ? 'error' : 'success'"
                  label
                  size="x-small"
                >
                  {{ item.is_archived ? 'مؤرشف' : 'متواجد' }}
                </VChip>
              </div>
              <div style="min-inline-size: 140px">
                <span>{{ item.user.account_name }}</span>
                <span class="text-sm text-disabled d-block">
                  {{ REMINDER_REQUEST_TYPES.get(item.type)?.label }}</span
                >
              </div>
            </router-link>
          </template>

          <template #item.phone="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.user.phone }}</span>
              <span class="text-sm text-disabled d-block"> {{ item.user.email }}</span>
            </div>
          </template>
          <template #item.product="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.product.name }}</span>
              <span class="text-sm text-disabled d-block"> {{ item.user.id }}</span>
            </div>
          </template>
          <template #item.from_quantity="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.from_quantity ?? '-' }}
              <span class="text-sm text-disabled d-block">{{ item.to_quantity ?? '-' }}</span>
            </div>
          </template>

          <template #item.created_at="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 95px">
              {{ formatDateTime(item.created_at) }}
              <span class="text-sm text-disabled d-block">
                {{ formatDateTime(item.product.from_date) }}</span
              >
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn @click="showViewModal(item)">
                <VIcon icon="tabler-eye" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="archiveItem(item)">
                      <template #prepend>
                        <VIcon :icon="item.is_archived ? 'tabler-archive-off' : 'tabler-archive'" />
                      </template>
                      <VListItemTitle>{{ item.is_archived ? 'استعادة' : 'أرشفة' }}</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.user)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>
                      <VListItemTitle>ارسال تنبيه لصاحب الطلب</VListItemTitle>
                    </VListItem>
                    <VListItem :disabled="!permissions.sendNotification">
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>
                      <VListItemTitle>ارسال تنبيه لصاحب عرض المنتج</VListItemTitle>
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
