<script setup lang="ts">
import DisputeRequestBasicData from '@/modules/disputes/components/DisputeRequestBasicData.vue'
import { requestsService } from '@/modules/disputes/services/RequestsService'
import { useAuthStore } from '@/stores/AuthStore'
import { useDisputesStore } from '@/stores/DisputesStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DisputeRequestDetailsTab = defineAsyncComponent(
  () => import('../components/DisputeRequestDetailsTab.vue'),
)
const DisputeRequestLogsTab = defineAsyncComponent(
  () => import('../components/DisputeRequestLogsTab.vue'),
)
const DisputeRequestConversationsTab = defineAsyncComponent(
  () => import('../components/DisputeRequestConversationsTab.vue'),
)
const DisputeRequestOtherDetailsTab = defineAsyncComponent(
  () => import('../components/DisputeRequestOtherDetailsTab.vue'),
)
const route = useRoute()
const router = useRouter()
const disputesStore = useDisputesStore()
const { hasPermission } = useAuthStore()
const isLoading = ref<boolean>(false)
const currentTab = ref<any>()
const disputeRequestId = +route.params.id

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
    {
      title: 'تفاصيل التنازع',
      value: 'details',
      component: DisputeRequestDetailsTab,
      show: hasPermission('view_dispute_details'),
    },
    {
      title: 'المحادثات',
      value: 'conversations',
      component: DisputeRequestConversationsTab,
      show: hasPermission('view_dispute_conversations'),
    },
    {
      title: ' ملخص العمليات',
      value: 'logs',
      component: DisputeRequestLogsTab,
      show: hasPermission('view_dispute_logs'),
    },
    {
      title: 'تفاصيل أخرى',
      value: 'other-details',
      component: DisputeRequestOtherDetailsTab,
      show: hasPermission('view_dispute_other_details'),
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
// reset basic data
disputesStore.setRequestDetails(null)
getBasicData()

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

function getBasicData() {
  isLoading.value = true
  requestsService
    .getSingleItem(disputeRequestId)
    .then((res) => {
      disputesStore.setRequestDetails(res.data.data)
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
          <PageBackBtn :link="{ name: 'disputes-requests-page' }" />
          <div>تفاصيل طلب التنازع</div>
        </div>
      </template>
      <VCardText>
        <DisputeRequestBasicData />
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab :value="tab.value" v-if="tab.show">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <template v-for="tab in tabs" :key="tab.value">
          <Component
            :is="tab.component"
            v-if="currentTab === tab.value && tab.show"
            @reload-basic-data="getBasicData"
          />
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
