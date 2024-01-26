<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import OfferBasicData from '../components/OfferBasicData.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const OfferDetailsTab = defineAsyncComponent(() => import('../components/OfferDetailsTab.vue'))
const OfferLogsTab = defineAsyncComponent(() => import('../components/OfferLogsTab.vue'))
const OfferStatsTab = defineAsyncComponent(() => import('../components/OfferStatsTab.vue'))

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
      title: 'بيانات العرض',
      value: 'details',
      component: OfferDetailsTab,
      show: true,
    },
    {
      title: 'سجل العمليات',
      value: 'logs',
      component: OfferLogsTab,
      show: hasPermission('view_offer_logs'),
    },
    {
      title: 'الاحصائيات',
      value: 'statistics',
      component: OfferStatsTab,
      show: hasPermission('view_offer_statistics'),
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
          <PageBackBtn :link="{ name: 'offers-page' }" />
          <div>تفاصيل العرض</div>
        </div>
      </template>
      <VCardText>
        <OfferBasicData />
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <template v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
