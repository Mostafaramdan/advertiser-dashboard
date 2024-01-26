<script setup lang="ts">
import AdBasicData from '@/components/ads/AdBasicData.vue'
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
import { adsService } from '@/services/AdsService'
import { useAdsStore } from '@/stores/AdsStore'
import { useAuthStore } from '@/stores/AuthStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(() => import('@/components/ads/AdDetailsTab.vue'))
const CommentsTab = defineAsyncComponent(() => import('@/components/ads/AdCommentsTab.vue'))
const ReportsTab = defineAsyncComponent(() => import('@/components/ads/AdReportsTab.vue'))
const route = useRoute()
const adsStore = useAdsStore()
const { hasPermission } = useAuthStore()
const { currentTab, updateRouteQuery } = UseTabsHelpers('details')
const isLoading = ref<boolean>(false)
const adRequestId = +route.params.id

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed<PageTab[]>(() => {
  return [
    {
      title: 'بيانات الاعلان',
      value: 'details',
      component: DetailsTab,
      show: true,
    },
    {
      title: 'التعليقات',
      value: 'comments',
      component: CommentsTab,
      show: hasPermission('view_ads_comments'),
    },
    {
      title: 'البلاغات',
      value: 'reports',
      component: ReportsTab,
      show: hasPermission('view_ads_reports_details'),
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
function getPageData() {
  adsStore.setAdDetails(null)
  isLoading.value = true
  adsService
    .getDetails(adRequestId)
    .then((res) => {
      adsStore.setAdDetails(res.data.data)
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <section class="ad-order-details">
    <VCard class="page-card">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'ads-page' }" />
          <div>تفاصيل الاعلان</div>
        </div>
      </template>
      <VCardText>
        <AdBasicData />
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <template v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
