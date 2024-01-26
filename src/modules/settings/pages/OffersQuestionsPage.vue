<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import OffersQuestionsCategoriesList from '../components/OffersQuestionsCategoriesList.vue'
import OffersQuestionsList from '../components/OffersQuestionsList.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const { currentTab, updateRouteQuery } = UseTabsHelpers('questions')
const tabs: PageTab[] = [
  {
    title: 'الأسئلة الشائعة',
    value: 'questions',
    component: OffersQuestionsList,
    show: hasPermission('offers_view_questions'),
  },
  {
    title: 'أقسام الأسئلة الشائعة',
    value: 'categories',
    component: OffersQuestionsCategoriesList,
    show: hasPermission('offers_view_support_categories'),
  },
]
// #endregion
</script>

<template>
  <VCard title="الاسئلة الشائعة" class="page-card">
    <VCardText>
      <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
      <div v-for="tab in tabs" :key="tab.value">
        <Component :is="tab.component" v-if="currentTab === tab.value" />
      </div>
    </VCardText>
  </VCard>
</template>
