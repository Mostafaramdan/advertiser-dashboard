<script setup lang="ts">
import QuestionsCategoriesList from '../components/QuestionsCategoriesList.vue'
import QuestionsList from '../components/QuestionsList.vue'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const router = useRouter()
const { canAccessPage } = useAuthStore()
const currentTab = ref<any>()

const tabs = [
  {
    title: 'الأسئلة الشائعة',
    value: 'questions',
    component: QuestionsList,
    show: canAccessPage('questions'),
  },
  {
    title: 'أقسام الأسئلة الشائعة',
    value: 'categories',
    component: QuestionsCategoriesList,
    show: canAccessPage('support_categories'),
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

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
  <VCard title="الاسئلة الشائعة" class="page-card">
    <VCardText>
      <VTabs v-model="currentTab" class="mb-3 v-tabs-pill" @update:model-value="updateRouteQuery">
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
</template>
