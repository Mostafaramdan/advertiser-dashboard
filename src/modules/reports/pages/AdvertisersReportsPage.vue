<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { useAuthStore } from '@/stores/AuthStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { AdvertiserReport } from '../interfaces/AdvertiserReport'
import { advertisersReportsService } from '../services/AdvertisersReportsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission, canAccessPage } = useAuthStore()
const MODEL_NAME = 'reports'
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)

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
} = UseCrudHelpers<AdvertiserReport>(advertisersReportsService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'المعلن',
    key: 'advertiser',
  },
  {
    title: 'عدد البلاغات',
    key: 'reported_count',
    align: 'center',
  },
  {
    title: 'نسبة البلاغات',
    key: 'reported_rate',
    align: 'center',
  },
  {
    title: 'عدد الطلبات',
    key: 'ads_request_count',
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
  viewAdDetails: canAccessPage('ads_details'),
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
    <VCard title="بلاغات المعلنين" class="page-card">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
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
          <template #item.advertiser="{ item }">
            <router-link
              :to="{
                name: 'advertisers-profile-page',
                params: { id: item.raw.advertiser.id },
                query: { tab: 'details' },
              }"
              class="d-flex align-center"
            >
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg
                    v-if="item.raw.advertiser.image_path"
                    :src="item.raw.advertiser.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="min-width: 205px">
                <span>{{ item.raw.advertiser.username }}</span>
                <span class="text-sm text-disabled d-block">{{ item.raw.advertiser.phone }}</span>
              </div>
            </router-link>
          </template>
          <template #item.reports_count="{ item }">
            <div class="text-no-wrap" style="min-width: 80px">
              {{ item.raw.reports_count }}
              <span class="text-sm text-disabled d-block">{{ item.raw.report_rate }}%</span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <!-- TODO: ADd link -->
              <!-- <IconBtn
                :disabled="!permissions.viewAdDetails"
                :to="{
                  name: 'ad-details-page',
                  params: { id: item.raw.id },
                  query: { tab: 'reports' },
                }"
              >
                <VIcon icon="tabler-eye" />
              </IconBtn> -->
              <IconBtn
                :disabled="!permissions.sendNotification"
                @click="openNotificationModal(item.raw.advertiser)"
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
