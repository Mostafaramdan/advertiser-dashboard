<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
import AdsSpaceBasicData from '@/modules/ads-spaces/components/AdsSpaceBasicData.vue'
import { useAuthStore } from '@/stores/AuthStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const AdsSpaceDetailsTab = defineAsyncComponent(
  () => import('../components/AdsSpaceDetailsTab.vue'),
)
const AdsSpaceStatsTab = defineAsyncComponent(() => import('../components/AdsSpaceStatsTab.vue'))
const AdsSpaceRequestsTab = defineAsyncComponent(
  () => import('../components/AdsSpaceRequestsTab.vue'),
)
const AdsSpaceSharesTab = defineAsyncComponent(() => import('../components/AdsSpaceSharesTab.vue'))
const { hasPermission } = useAuthStore()
const { currentTab, updateRouteQuery } = UseTabsHelpers('details')
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed<PageTab[]>(() => {
  return [
    {
      title: 'بيانات المساحة',
      value: 'details',
      component: AdsSpaceDetailsTab,
      show: true,
    },
    {
      title: 'الإحصائيات',
      value: 'statistics',
      component: AdsSpaceStatsTab,
      show: hasPermission('view_ad_space_statistics'),
    },
    {
      title: 'الطلبات',
      value: 'requests',
      component: AdsSpaceRequestsTab,
      show: hasPermission('view_ad_space_requests'),
    },
    {
      title: ' المشاركات والعمليات',
      value: 'shares',
      component: AdsSpaceSharesTab,
      show: hasPermission('view_space_shares'),
    },
  ]
})
// #endregion
</script>

<template>
  <section class="ad-order-details">
    <VCard class="page-card">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'ads-spaces-page' }" />
          <div>تفاصيل المساحة</div>
        </div>
      </template>
      <VCardText>
        <AdsSpaceBasicData />
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <template v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
