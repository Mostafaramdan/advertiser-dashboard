<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { TICKETS_STATUSES, USERS_TYPES } from '@/constants/tickets'
import type { pageAction } from '@/interfaces/Shared'
import { sharedService } from '@/services/SharedService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'

import SupportTicketsStats from '../components/SupportTicketsStats.vue'
import type { SupportTicket, SupportTicketAdminRole } from '../interfaces/SupportTicket'
import SupportTicketEditModal from '../modals/SupportTicketEditModal.vue'
import TransferTicketModal from '../modals/TransferTicketModal.vue'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('../components/SupportTicketsFilter.vue'))
const { t } = useI18n()
const toast = useToast()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'tickets'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const showTransferTicketModal = ref<boolean>(false)
const showEditModal = ref<boolean>(false)
const activeTicket = ref<SupportTicket | null>(null)
const transferTicketRole = ref<SupportTicketAdminRole | null>(null)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  IsLoadingData,
  confirmModal,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showConfirmDeleteItem,
} = UseCrudHelpers<SupportTicket>(supportTicketsService, params, MODEL_NAME)

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
const permissions = computed(() => ({
  delete: hasPermission('delete_ticket'),
  viewTicketDetails: hasPermission('view_ticket_details'),
  transferTicketToAdmin: hasPermission('assign_ticket'),
  edit: hasPermission('change_ticket_status'),
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

function toggleFavorite(item: SupportTicket) {
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

function openTransferTicketModal(ticket: SupportTicket, adminRole: SupportTicketAdminRole) {
  activeTicket.value = ticket
  transferTicketRole.value = adminRole
  showTransferTicketModal.value = true
}

function openEditTicketModal(ticket: SupportTicket) {
  activeTicket.value = ticket
  showEditModal.value = true
}

function onUpdateTicket(ticket: SupportTicket) {
  const targetIndex = tableData.value.findIndex((item) => item.id === ticket.id)
  if (targetIndex !== -1) tableData.value.splice(targetIndex, 1, ticket)
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
    <ConfirmModal ref="confirmModal" />
    <TransferTicketModal
      v-if="showTransferTicketModal && activeTicket && transferTicketRole"
      v-model:showModal="showTransferTicketModal"
      :ticket-id="activeTicket.id"
      :transfer-ticket-role="transferTicketRole"
      @transfer:ticket="onUpdateTicket"
    />
    <SupportTicketEditModal
      :ticket="activeTicket"
      v-if="activeTicket && showEditModal"
      v-model:showModal="showEditModal"
      @edit-item="onUpdateTicket"
    />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
    />
    <VCard class="page-card">
      <template #title> تذاكر الدعم {{ metaData && `(${metaData.total})` }} </template>
      <VCardText>
        <SupportTicketsStats />
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

          <template #item.primary_admin="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.primary_admin.name }}</span>
              <span
                class="text-sm text-disabled d-block"
                :class="{
                  'text-error': item.primary_admin.status === 'failed',
                  'text-success': item.primary_admin.status === 'success',
                }"
                >{{ item.primary_admin.hours }}</span
              >
            </div>
          </template>
          <template #item.secondary_admin="{ item }">
            <div style="min-inline-size: 150px">
              <span>{{ item.secondary_admin.name }}</span>
              <span
                class="text-sm text-disabled d-block"
                :class="{
                  'text-error': item.secondary_admin.status === 'failed',
                  'text-success': item.secondary_admin.status === 'success',
                }"
                >{{ item.secondary_admin.hours }}</span
              >
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewTicketDetails"
                :to="{
                  name: 'ticket-details-page',
                  params: { id: item.id },
                  query: { tab: 'details' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>حذف</VListItemTitle>
                    </VListItem>
                    <VListItem :disabled="!permissions.edit" @click="openEditTicketModal(item)">
                      <template #prepend>
                        <VIcon icon="tabler-edit" />
                      </template>
                      <VListItemTitle>تعديل </VListItemTitle>
                    </VListItem>
                    <VListItem @click="toggleFavorite(item)">
                      <template #prepend>
                        <VIcon
                          icon="tabler-star-filled"
                          :color="item.is_starred ? '#ffcc00' : 'dark'"
                        />
                      </template>

                      <VListItemTitle>اضافة للمفضلة</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.transferTicketToAdmin"
                      @click="openTransferTicketModal(item, 'primary')"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-refresh" />
                      </template>

                      <VListItemTitle>استبدال المسؤؤل الاول</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.transferTicketToAdmin"
                      @click="openTransferTicketModal(item, 'secondary')"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-refresh" />
                      </template>

                      <VListItemTitle>استبدال المسؤؤل الثاني</VListItemTitle>
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
