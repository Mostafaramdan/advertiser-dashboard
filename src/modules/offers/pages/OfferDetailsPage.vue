<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import OfferBasicData from '../components/OfferBasicData.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const OfferDetailsTab = defineAsyncComponent(() => import('../components/OfferDetailsTab.vue'))
const OfferLogsTab = defineAsyncComponent(() => import('../components/OfferLogsTab.vue'))
const OfferNotesTab = defineAsyncComponent(() => import('../components/OfferNotesTab.vue'))
const OfferStatsTab = defineAsyncComponent(() => import('../components/OfferStatsTab.vue'))
const OfferStartRemindersTab = defineAsyncComponent(
  () => import('../components/OfferStartRemindersTab.vue'),
)
const OfferQtyAvailabilityRemindersTab = defineAsyncComponent(
  () => import('../components/OfferQtyAvailabilityRemindersTab.vue'),
)

const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const currentTab = ref<any>()

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
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
      title: 'سجل الملاحظات',
      value: 'notes',
      component: OfferNotesTab,
      show: hasPermission('view_offer_notes'),
    },
    {
      title: 'الاحصائيات',
      value: 'statistics',
      component: OfferStatsTab,
      show: hasPermission('view_offer_statistics'),
    },
    {
      title: 'طلبات تنبية بدء العرض',
      value: 'start-reminders',
      component: OfferStartRemindersTab,
      show: hasPermission('view_start_reminder_requests'),
    },
    {
      title: 'طلبات تنبية توفر الكمية',
      value: 'quantity-availability-reminders',
      component: OfferQtyAvailabilityRemindersTab,
      show: hasPermission('view_availability_reminder_requests'),
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
    <VCard class="page-card">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'offers-page' }" />
          <div>تفاصيل العرض</div>
        </div>
      </template>
      <VCardText>
        <OfferBasicData />
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <template v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
