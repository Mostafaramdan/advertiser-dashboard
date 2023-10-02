<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { MetaData } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { ChatRate } from '../interfaces/ChatRate'
import { reportsService } from '../services/ReportsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const tableData = ref<ChatRate[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'الموظف',
    key: 'employee',
  },
  {
    title: 'المُقيم',
    key: 'rater',
  },
  {
    title: 'تاريخ التقييم',
    key: 'created_at',
  },
  {
    title: 'الدولة',
    key: 'rater.country_name',
  },
  {
    title: 'التعليق',
    key: 'comment',
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
  reportsService
    .getChatRates(params)
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
    <VCard title="تقييم الشات" class="page-card">
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
          <template #item.employee="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.employee.image_path"
                    :src="item.raw.employee.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 205px">
                <span>{{ item.raw.employee.username }}</span>
                <span class="text-sm text-disabled d-block">{{ item.raw.employee.phone }}</span>
              </div>
            </div>
          </template>
          <template #item.rater="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.raw.rater.image_path" :src="item.raw.rater.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 205px">
                <span>{{ item.raw.rater.username }}</span>
                <span class="text-sm text-disabled d-block">{{ item.raw.rater.phone }}</span>
              </div>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="text-no-wrap">
              {{ formatDateTime(item.raw.created_at) }}
            </div>
          </template>
          <template #item.rater.country_name="{ item }">
            <div style="min-width: 100px">
              {{ item.raw.rater.country_name }}
            </div>
          </template>
          <template #item.comment="{ item }">
            <div class="my-2" style="min-width: 150px; max-width: 280px">
              {{ item.raw.comment }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.raw.employee)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>

                      <VListItemTitle>إرسال تنبيه للموظف</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.sendNotification"
                      @click="openNotificationModal(item.raw.rater)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>

                      <VListItemTitle>إرسال تنبيه للمُقيم</VListItemTitle>
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
