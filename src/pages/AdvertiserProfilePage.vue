<script setup lang="ts">
import DetailsTab from '@/components/advertiser-profile/DetailsTab.vue'
import LicensesAndDocumentsTab from '@/components/advertiser-profile/LicensesAndDocumentsTab.vue'
import ProfileBasicInfo from '@/components/advertiser-profile/ProfileBasicInfo.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const router = useRouter()
const currentTab = ref<any>()

// #endregion

// TODO: ADD permissions
const tabs = [
  {
    title: 'بيانات التاجر',
    value: 'details',
    component: DetailsTab,
    show: true,
  },
  {
    title: 'التراخيص والوثائق',
    value: '',
    component: LicensesAndDocumentsTab,
    show: true,
  },
]

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
// check tab from query
onMounted(() => {
  const tab = route.query.tab
  if (tab) currentTab.value = tab
  else currentTab.value = tabs[0].value
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function updateRouteQuery() {
  router.push({ path: route.fullPath, query: { tab: currentTab.value } })
}

// #endregion
</script>

<template>
  <section class="advertiser-profile">
    <div class="d-flex overflow-auto text-nowrap mb-3 align-center">
      <PageBackBtn :link="{ name: 'advertisers-page' }" />
      <VBtn variant="outlined" class="me-3">
        سجل النشاطات
        <VIcon end icon="tabler-history" />
      </VBtn>
      <VBtn variant="outlined" class="me-3">
        استعراض الإعلانات <VIcon end icon="tabler-ad-2" />
      </VBtn>
      <VBtn variant="outlined" class="me-3">
        استعراض الطلبات <VIcon end icon="tabler-file-check" />
      </VBtn>
    </div>
    <ProfileBasicInfo />
    <VCard>
      <VCardText class="pa-4">
        <VTabs
          v-model="currentTab"
          class="mb-3 v-tabs-pill"
          @update:model-value="updateRouteQuery"
        >
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <div v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value" />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>
