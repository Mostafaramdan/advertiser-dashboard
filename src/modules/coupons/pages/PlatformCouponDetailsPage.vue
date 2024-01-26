<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const SubscribersHistoryTab = defineAsyncComponent(
  () => import('../components/SubscribersHistoryTab.vue'),
)
const OperationsHistoryTab = defineAsyncComponent(
  () => import('../components/OperationsHistoryTab.vue'),
)
const PlatformCouponDetailsTab = defineAsyncComponent(
  () => import('../components/PlatformCouponDetailsTab.vue'),
)
const route = useRoute()
const { hasPermission } = useAuthStore()
const isLoading = ref<boolean>(false)
const { currentTab, updateRouteQuery } = UseTabsHelpers('details')

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed<PageTab[]>(() => {
  return [
    {
      title: 'تفاصيل الكوبون',
      value: 'details',
      component: PlatformCouponDetailsTab,
      show: hasPermission('view_platform_coupons'),
    },
    {
      title: 'سجل المشتركين',
      value: 'subscribers-history',
      component: SubscribersHistoryTab,
      show: hasPermission('view_coupon_subscriber_logs'),
    },
    {
      title: 'سجل العمليات',
      value: 'operations-history',
      component: OperationsHistoryTab,
      show: hasPermission('view_coupon_transactions_history'),
    },
  ]
})
// #endregion
</script>

<template>
  <section class="ad-order-details">
    <VCard class="page-card" v-loading="isLoading">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'platform-coupons-page' }" />
          <div>
            كوبون المنصة
            <span>رقم ({{ route.params.id }})</span>
          </div>
        </div>
      </template>
      <VCardText>
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <template v-if="!isLoading">
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
          </div>
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
