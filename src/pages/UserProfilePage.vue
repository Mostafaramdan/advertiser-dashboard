<script setup lang="ts">
import ProfileBasicInfo from '@/components/user-profile/ProfileBasicInfo.vue'
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
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
const AdsRequestsLogsTab = defineAsyncComponent(
  () => import('@/components/user-profile/AdsRequestsLogsTab.vue'),
)
const ChatBlockLogsTab = defineAsyncComponent(
  () => import('@/components/user-profile/ChatBlockLogsTab.vue'),
)
const route = useRoute()
const { hasPermission } = useAuthStore()
const { currentTab, updateRouteQuery } = UseTabsHelpers('details')
const user = ref<UserBasicData | null>(null)
const userId = ref<number>(+route.params.id)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tabs = computed<PageTab[]>(() => {
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
      show: hasPermission('show_attachments'),
    },
    {
      title: 'سجل طلبات الاعلانات',
      value: 'ads-requests-logs',
      component: AdsRequestsLogsTab,
      show: hasPermission('show_user_ads_request_logs'),
    },
    {
      title: 'سجل حظر المحادثات',
      value: 'chat-block-logs',
      component: ChatBlockLogsTab,
      show: hasPermission('show_chat_blocks'),
    },
  ]
})

// #endregion

/***************************************
 **** Section Watchers *****************
 **************************************/
// #region Watchers
watch(route, () => {
  // update advertiser id for notifications click actions as it used as a key to render the components
  userId.value = +route.params.id
})

// #endregion
</script>

<template>
  <section class="user-profile" :key="userId">
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
        <PageTabs :tab-items="tabs" v-model="currentTab" @update:model-value="updateRouteQuery" />
        <div v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value && tab.show" :user="user" />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>
