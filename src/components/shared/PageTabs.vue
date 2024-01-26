<script setup lang="ts">
import { PageTabsProps } from '@/interfaces/Shared'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
//#region Props
const props = defineProps<PageTabsProps>()
//#endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const currentTab = defineModel('modelValue')
//#endregion
</script>

<template>
  <VTabs v-model="currentTab" class="mb-3 v-tabs-pill">
    <template v-for="tab in tabItems" :key="tab.value">
      <VTab :value="tab.value" v-if="tab.show ?? true">
        {{ tab.title }}
      </VTab>
    </template>
  </VTabs>
</template>
