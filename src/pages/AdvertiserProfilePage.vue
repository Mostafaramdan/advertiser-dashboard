<script setup lang="ts">
import ProfileBasicInfo from '@/components/advertiser-profile/ProfileBasicInfo.vue'
import type { AdvertiserBasicData } from '@/interfaces/Advertiser'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/DetailsTab.vue'),
)
const LicensesDocumentsTab = defineAsyncComponent(
  () => import('@/components/user-profile/licenses-documents-tab/Index.vue'),
)
const MarketingPresentationTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/MarketingPresentationTab.vue'),
)
const AccountSettingsTab = defineAsyncComponent(
  () => import('@/components/advertiser-profile/AccountSettingsTab.vue'),
)
const route = useRoute()
const router = useRouter()
const { hasPermission, canAccessPage } = useAuthStore()
const currentTab = ref<any>()
const user = ref<AdvertiserBasicData | null>(null)
const advertiserId: number = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
    {
      title: 'بيانات المعلن',
      value: 'details',
      component: DetailsTab,
      show: hasPermission('show_advertiser_details'),
    },
    {
      title: 'التراخيص والوثائق',
      value: 'licenses-documents',
      component: LicensesDocumentsTab,
      show: hasPermission('show_attachments'),
    },
    {
      title: 'إعدادات الحساب',
      value: 'account-settings',
      component: AccountSettingsTab,
      show: hasPermission('show_account_settings'),
    },
    {
      title: 'العرض التسويقي',
      value: 'marketing-presentation',
      component: MarketingPresentationTab,
      show: hasPermission('show_marketer_info'),
    },
  ]
})

const permissions = computed(() => ({
  viewAds: canAccessPage('ads'),
}))

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
  <section class="advertiser-profile">
    <div class="d-flex overflow-auto text-nowrap mb-3 align-center">
      <PageBackBtn :link="{ name: 'advertisers-page' }" />
      <!-- TODO: ADD permissions -->
      <VBtn variant="outlined" class="me-3">
        سجل النشاطات
        <VIcon end icon="tabler-history" />
      </VBtn>
      <VBtn
        variant="outlined"
        class="me-3"
        :to="{ name: 'ads-page', query: { advertiser_id: advertiserId } }"
        :disabled="!permissions.viewAds"
      >
        استعراض الإعلانات <VIcon end icon="tabler-ad-2" />
      </VBtn>
      <VBtn variant="outlined" class="me-3">
        استعراض الطلبات <VIcon end icon="tabler-file-check" />
      </VBtn>
    </div>
    <ProfileBasicInfo @update:user="($event) => (user = $event)" />
    <VCard>
      <VCardText class="pa-4">
        <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <div v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" :user="user" />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>
