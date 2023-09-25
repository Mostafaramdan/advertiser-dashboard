<script setup lang="ts">
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
const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const isLoading = ref<boolean>(false)
const currentTab = ref<any>()

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
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
  <section class="ad-order-details">
    <VCard class="page-card" v-loading="isLoading">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'platform-coupons-page' }" />
          <div>
            سجل الكوبون
            <span>رقم ({{ route.params.id }})</span>
          </div>
        </div>
      </template>
      <VCardText>
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab :value="tab.value" v-if="tab.show">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <template v-if="!isLoading">
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
          </div>
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
