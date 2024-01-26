<script setup lang="ts">
import UseTabsHelpers from '@/composables/UseTabsHelpers'
import { PageTab } from '@/interfaces/Shared'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface LicensesDocumentsHistoryModalProps {
  showModal: boolean
  activeId: number
  activeTab?: string
}

const props = withDefaults(defineProps<LicensesDocumentsHistoryModalProps>(), {
  showModal: false,
  activeTab: 'details',
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const showModal = useVModel(props, 'showModal', emit)
const { currentTab } = UseTabsHelpers(props.activeTab)
const tabs: PageTab[] = [
  {
    title: 'سجل التنبيهات',
    value: 'notifications',
    component: defineAsyncComponent(() => import('./NotificationsHistory.vue')),
  },
  {
    title: 'سجل الملاحظات',
    value: 'notes',
    component: defineAsyncComponent(() => import('./NotesHistory.vue')),
  },
  {
    title: 'سجل الحركة',
    value: 'logs',
    component: defineAsyncComponent(() => import('./LogsHistory.vue')),
  },
]

// #endregion
</script>

<template>
  <VDialog
    v-model="showModal"
    fullscreen
    :scrim="false"
    scrollable
    transition="dialog-bottom-transition"
  >
    <!-- Dialog Content -->
    <VCard>
      <div>
        <!-- Toolbar -->
        <VToolbar
          density="compact"
          title="السجل"
          style="position: sticky; z-index: 1; inline-size: 100%; inset-block-start: 0"
          elevation="2"
          color="grey-200"
        >
          <VBtn icon @click="showModal = false" color="dark" size="40">
            <VIcon icon="tabler-x" size="24" />
          </VBtn>
        </VToolbar>

        <!-- tabs -->
        <VCardText class="pa-4">
          <PageTabs :tab-items="tabs" v-model="currentTab" />
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value" :activeId="activeId" />
          </div>
        </VCardText>
      </div>
    </VCard>
  </VDialog>
</template>
