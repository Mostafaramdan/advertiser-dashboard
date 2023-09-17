<script setup lang="ts">
import AdBasicData from '@/components/ads/AdBasicData.vue'
import { adsService } from '@/services/AdsService'
import { useAdsStore } from '@/stores/AdsStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(() => import('@/components/ads/AdDetailsTab.vue'))
const route = useRoute()
const router = useRouter()
const adsStore = useAdsStore()
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
      title: 'بيانات الاعلان',
      value: 'details',
      component: DetailsTab,
      show: true,
    },
    // {
    //   title: 'التعليقات',
    //   value: 'comments',
    //   component: AdsRequestContentTab,
    // },
    // {
    //   title: 'البلاغات',
    //   value: 'reports',
    //   component: AdsRequestHistoryTab,
    // },
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
    <VCard class="page-card" v-loading="isLoading">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn :link="{ name: 'ads-page' }" />
          <div>تفاصيل الاعلان</div>
        </div>
      </template>
      <VCardText>
        <AdBasicData />
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <template>
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" />
          </div>
        </template>
      </VCardText>
    </VCard>
  </section>
</template>
