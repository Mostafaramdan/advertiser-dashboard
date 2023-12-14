<script setup lang="ts">
import type { CounterItem } from '../interfaces/Logs'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: CounterItem[] }>(), {})

// #endregion
</script>

<template>
  <div class="information-list">
    <VRow class="my-0">
      <VCol
        v-for="(item, index) in data"
        :key="index"
        class="py-2 information-list__item"
        cols="12"
        sm="6"
        lg="4"
      >
        <h5 class="text-primary text-subtitle-2">
          {{ item.title }}
        </h5>
        <p class="text-body-2 mb-0">
          {{ item.value ?? '-' }}
        </p>
      </VCol>
    </VRow>
  </div>
</template>
