<script setup lang="ts">
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface LicensesDocumentsHistoryModalProps {
  showModal: boolean
  activeId: number
}

const props = withDefaults(defineProps<LicensesDocumentsHistoryModalProps>(), {
  showModal: false
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
const currentTab = ref<string>('details')
const tabs = [
  {
    title: 'سجل التنبيهات',
    value: 'notifications',
    component: defineAsyncComponent(() => import('./NotificationsHistory.vue'))
  },
  {
    title: 'سجل الملاحظات',
    value: 'notes',
    component: defineAsyncComponent(() => import('./NotesHistory.vue'))
  }
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
          style="position: sticky; z-index: 1; top: 0; width: 100%"
          elevation="2"
        >
          <VBtn icon @click="showModal = false" color="dark" size="40">
            <VIcon icon="tabler-x" size="24" />
          </VBtn>
        </VToolbar>

        <!-- tabs -->
        <VCardText class="pa-4">
          <VTabs v-model="currentTab" class="mb-3 v-tabs-pill">
            <template v-for="tab in tabs" :key="tab.value">
              <VTab :value="tab.value">
                {{ tab.title }}
              </VTab>
            </template>
          </VTabs>
          <div v-for="tab in tabs" :key="tab.value">
            <Component :is="tab.component" v-if="currentTab === tab.value" :activeId="activeId" />
          </div>
        </VCardText>
      </div>
    </VCard>
  </VDialog>
</template>
