<script setup lang="ts">
import ProfileBasicInfo from '@/components/user-profile/ProfileBasicInfo.vue'
import type { UserBasicData } from '@/interfaces/User'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DetailsTab = defineAsyncComponent(() => import('@/components/user-profile/DetailsTab.vue'))
const LicensesDocumentsTab = defineAsyncComponent(
  () => import('@/components/user-profile/licenses-documents-tab/Index.vue'),
)
const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const currentTab = ref<any>()
const user = ref<UserBasicData | null>(null)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed(() => {
  return [
    {
      title: 'بيانات التاجر',
      value: 'details',
      component: DetailsTab,
      show: hasPermission('view_user_details'),
    },
    {
      title: 'التراخيص والوثائق',
      value: 'licenses-documents',
      component: LicensesDocumentsTab,
      show: hasPermission('view_attachments'),
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
  <section class="user-profile">
    <div class="d-flex overflow-auto text-nowrap mb-3 align-center">
      <PageBackBtn :link="{ name: 'users-page' }" />
      <!-- TODO: ADD permissions -->
      <VBtn variant="outlined" class="me-3">
        سجل النشاطات
        <VIcon end icon="tabler-history" />
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
