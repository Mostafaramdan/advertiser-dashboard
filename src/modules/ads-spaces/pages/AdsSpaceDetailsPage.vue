<script setup lang="ts">
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
          <PageBackBtn :link="{ name: 'ads-spaces-page' }" />
          <div>تفاصيل المساحة</div>
        </div>
      </template>
      <VCardText>
        <AdsSpaceBasicData />
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab :value="tab.value" v-if="tab.show">
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
