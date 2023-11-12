<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import type { ChatBlockLogsItem } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const userId = +route.params.id
const tableData = ref<ChatBlockLogsItem[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'رقم الحظر',
    key: 'id',
  },
  {
    title: 'اسم الحاظر',
    key: 'blocker.username',
  },
  {
    title: 'تاريخ الحظر',
    key: 'created_at',
  },
  {
    title: 'رقم الجوال',
    key: 'blocker.phone',
  },
  {
    title: 'الدولة',
    key: 'blocker.country_name',
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
function getPageData(): void {
  isLoadingData.value = true
  usersService
    .getChatBlockLogs(userId, params)
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      isLoadingData.value = false
    })
}

/**
 * @description reload page data
 * @return  {void}
 */
function reloadPageData(): void {
  params.page = 1
  getPageData()
}

/**
 * @description update search keyword and reload page data
 * @param  {string} value
 * @return  {void}
 */
function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

/**
 * @description update items per page and reload page data
 * @param  {number} value
 * @return  {void}
 */
function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

// #endregion
</script>

<template>
  <section>
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="reloadPageData"
      />

      <VDataTableServer
        v-loading="isLoadingData"
        :headers="headers"
        :items="tableData"
        :items-length="metaData?.total || 0"
        class="app-table"
        :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.blocker.account_name="{ item }">
          <div style="min-inline-size: 150px">
            {{ item.blocker.account_name }}
          </div>
        </template>
        <template #item.blocker.country_name="{ item }">
          <div style="min-inline-size: 100px">
            {{ item.blocker.country_name }}
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
            <span class="text-sm text-disabled d-block"> {{ item.phone }}</span>
          </div>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn
              :disabled="!permissions.sendNotification"
              @click="openNotificationModal(item.blocker)"
            >
              <VIcon icon="tabler-mail" />
            </IconBtn>
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
    </div>
  </section>
</template>
