<script setup lang="ts">
import ProfileBasicInfo from '@/components/advertiser-profile/ProfileBasicInfo.vue'
import type { AdvertiserBasicData } from '@/interfaces/Advertiser'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/DetailsTab.vue'),
)
const LicensesDocumentsTab = defineAsyncComponent(
  () => import('@/components/user-profile/licenses-documents-tab/Index.vue'),
)
const MarketingPresentationTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/MarketingPresentationTab.vue'),
)
const AccountSettingsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/AccountSettingsTab.vue'),
)
const StatisticsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/StatisticsTab.vue'),
)
const ReportsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/ReportsTab.vue'),
)
const AdsBlockTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/AdsBlockTab.vue'),
)
const AdsRequestsLogsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/AdsRequestsLogsTab.vue'),
)
const route = useRoute()
const router = useRouter()
const { hasPermission, canAccessPage } = useAuthStore()
const currentTab = ref<any>()
const user = ref<AdvertiserBasicData | null>(null)
const advertiserId: number = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
    {
      title: 'بيانات المعلن',
      value: 'details',
      component: DetailsTab,
      show: hasPermission('show_advertiser_details'),
    },
    {
      title: 'التراخيص والوثائق',
      value: 'licenses-documents',
      component: LicensesDocumentsTab,
      show: hasPermission('show_attachments'),
    },
    {
      title: 'إعدادات الحساب',
      value: 'account-settings',
      component: AccountSettingsTab,
      show: hasPermission('show_account_settings'),
    },
    {
      title: 'إحصائات الحساب',
      value: 'statistics',
      component: StatisticsTab,
      show: hasPermission('show_advertiser_statistics'),
    },
    {
      title: 'العرض التسويقي',
      value: 'marketing-presentation',
      component: MarketingPresentationTab,
      show: hasPermission('show_marketer_info'),
    },
    {
      title: 'البلاغات',
      value: 'reports',
      component: ReportsTab,
      show: hasPermission('view_advertiser_report_details'),
    },
    {
      title: 'حظر عرض الاعلانات',
      value: 'ads-block',
      component: AdsBlockTab,
      show: hasPermission('view_advertiser_block_details'),
    },
    {
      title: 'سجل طلبات الاعلانات',
      value: 'ads-requests-logs',
      component: AdsRequestsLogsTab,
      show: hasPermission('show_advertiser_ads_request_logs'),
    },
  ]
})

const permissions = computed(() => ({
  viewAds: canAccessPage('ads'),
  viewAdsRequests: canAccessPage('ads_requests'),
  viewSubscriptionsLogs: canAccessPage('subscription_requests_logs'),
}))

// #endregion

/***************************************
 **** Section Watchers *****************
 **************************************/
// #region Watchers
watch(route, () => {
  currentTab.value = route.query?.tab
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
// check tab from query
onMounted(() => {
  const tab = route.query.tab
  if (tab) currentTab.value = tab
  else currentTab.value = tabs.value[0].value
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function updateRouteQuery() {
  nextTick(() => {
    router.push({ path: route.fullPath, query: { tab: currentTab.value } })
  })
}

// #endregion
</script>

<template>
  <section class="advertiser-profile">
    <div class="d-flex overflow-auto text-nowrap mb-3 align-center">
      <PageBackBtn :link="{ name: 'advertisers-page' }" />
      <template v-if="user">
        <VBtn
          variant="outlined"
          class="me-3"
          :to="{
            name: 'subscriptions-logs-page',
            query: { user_id: advertiserId, advertiser_name: user.username },
          }"
          target="_blank"
          :disabled="!permissions.viewSubscriptionsLogs"
        >
          سجل الاشتراكات
          <VIcon end icon="tabler-history" />
        </VBtn>
        <VBtn
          variant="outlined"
          class="me-3"
          :to="{
            name: 'ads-page',
            query: { advertiser_id: advertiserId, advertiser_name: user.username },
          }"
          target="_blank"
          :disabled="!permissions.viewAds"
        >
          استعراض الإعلانات <VIcon end icon="tabler-ad-2" />
        </VBtn>
        <VBtn
          variant="outlined"
          class="me-3"
          :to="{
            name: 'ads-requests-page',
            query: { advertiser_id: advertiserId, advertiser_name: user.username },
          }"
          target="_blank"
          :disabled="!permissions.viewAdsRequests"
        >
          استعراض الطلبات <VIcon end icon="tabler-file-check" />
        </VBtn>
      </template>
    </div>
    <ProfileBasicInfo @update:user="($event) => (user = $event)" />
    <VCard>
      <VCardText class="pa-4">
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <div v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" :user="user" />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>
