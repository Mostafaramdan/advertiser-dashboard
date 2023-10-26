<script setup lang="ts">
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
withDefaults(defineProps<{ title: string; stats: { label: string; value: string }[] }>(), {})

// #endregion
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle>{{ title }}</VExpansionPanelTitle>
      <VExpansionPanelText>
        <div class="information-list">
          <VRow>
            <VCol
              v-for="(item, index) in stats"
              :key="index"
              class="py-2 information-list__item justify-space-between"
              cols="12"
            >
              <h5 class="text-primary text-subtitle-2">
                {{ item.label }}
              </h5>
              <p class="text-body-2 mb-0">
                {{ item.value ?? '-' }}
              </p>
            </VCol>
          </VRow>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
