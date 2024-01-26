<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
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
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <template v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
