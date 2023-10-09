<script setup lang="ts">
import { MetaData } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { ChatBlock } from '../interfaces/ChatBlock'
import { reportsService } from '../services/ReportsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const tableData = ref<ChatBlock[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'المستخدم',
    key: 'blocked',
  },
  {
    title: 'عدد مرات الحظر',
    key: 'blocks_count',
    align: 'center',
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
  viewDetails: hasPermission('view_advertiser_report_details'),
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
  reportsService
    .getChatBlockList(params)
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

/**
 * @description reload page data and reset selected items
 */
function onReloadData(): void {
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
    <VCard title="حظر المحادثات" class="page-card">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-loading="isLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.blocked="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.blocked.image_path"
                    :src="item.raw.blocked.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 205px">
                <span>{{ item.raw.blocked.username }}</span>
                <span class="text-sm text-disabled d-block">{{ item.raw.blocked.phone }}</span>
              </div>
            </div>
          </template>
          <template #item.blocks_count="{ item }">
            <div class="text-no-wrap" style="min-width: 80px">
              {{ item.raw.blocks_count }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn
                :disabled="!permissions.viewDetails"
                :to="{ name: 'chat-block-details-page', params: { id: item.raw.id } }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn>
              <IconBtn
                :disabled="!permissions.sendNotification"
                @click="openNotificationModal(item.raw.blocked)"
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
