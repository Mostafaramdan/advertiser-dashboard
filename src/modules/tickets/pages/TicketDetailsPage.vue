<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import TicketBasicData from '../components/TicketBasicData.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const TicketDetailsTab = defineAsyncComponent(() => import('../components/TicketDetailsTab.vue'))
const TicketConversationsTab = defineAsyncComponent(
  () => import('../components/TicketConversationsTab.vue'),
)
const TicketLogsTab = defineAsyncComponent(() => import('../components/TicketLogsTab.vue'))
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
      title: 'بيانات التذكرة',
      value: 'details',
      component: TicketDetailsTab,
      show: hasPermission('view_ticket_details'),
    },
    {
      title: 'المحادثات',
      value: 'conversations',
      component: TicketConversationsTab,
      show: hasPermission('view_ticket_conversations'),
    },
    {
      title: ' ملخص العمليات',
      value: 'logs',
      component: TicketLogsTab,
      show: hasPermission('view_ticket_logs'),
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
          <PageBackBtn :link="{ name: 'support-tickets-page' }" />
          <div>تفاصيل التذكرة</div>
        </div>
      </template>
      <VCardText>
        <TicketBasicData />
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
