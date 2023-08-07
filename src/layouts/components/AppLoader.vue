<script setup lang="ts">
import { useSharedStore } from '@/stores/SharedStore'

const sharedStore = useSharedStore()

const isLoading = computed(() => sharedStore.loading)

defineProps({
  fullScreen: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="isLoading" class="app-loader-bar" :class="{ 'full-screen': fullScreen }">
    <VProgressCircular
      v-if="fullScreen"
      :size="50"
      width="3"
      color="primary"
      indeterminate
    />
    <VProgressLinear
      v-else
      indeterminate
      color="primary"
      height="3"
    />
  </div>
</template>
