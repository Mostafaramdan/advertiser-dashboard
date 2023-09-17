<script setup lang="ts">
import AdsRequestBasicData from '@/components/ads-requests/AdsRequestBasicData.vue'
import { adsRequestsService } from '@/services/AdsRequestsService'
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(
  () => import('@/components/ads-requests/AdsRequestDetailsTab.vue'),
)
const AdsRequestHistoryTab = defineAsyncComponent(
  () => import('@/components/ads-requests/AdsRequestHistoryTab.vue'),
)
const AdsRequestContentTab = defineAsyncComponent(
  () => import('@/components/ads-requests/AdsRequestContentTab.vue'),
)
const route = useRoute()
const router = useRouter()
const adsRequestsStore = useAdsRequestsStore()
const isLoading = ref<boolean>(false)
const currentTab = ref<any>()
const adRequestId = +route.params.id

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
    {
      title: 'بيانات الطلب',
      value: 'details',
      component: DetailsTab,
    },
    {
      title: 'محتوي الطلب',
      value: 'content',
      component: AdsRequestContentTab,
    },
    {
      title: 'سجل حركة الطلب',
      value: 'history',
      component: AdsRequestHistoryTab,
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
getPageData()

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

function getPageData() {
  adsRequestsStore.setAdsRequestDetails(null)
  isLoading.value = true
  adsRequestsService
    .getDetails(adRequestId)
    .then((res) => {
      adsRequestsStore.setAdsRequestDetails(res.data.data)
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <section class="ad-order-details">
    <VCard class="page-card" v-loading="isLoading">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'ads-requests-page' }" />
          <div>تفاصيل الطلب</div>
        </div>
      </template>
      <VCardText>
        <AdsRequestBasicData />
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <VTab :value="tab.value" v-for="tab in tabs" :key="tab.value">
            {{ tab.title }}
          </VTab>
        </VTabs>
        <template v-if="!isLoading">
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value" />
          </div>
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
