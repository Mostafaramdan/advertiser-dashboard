<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'

defineProps({
  navLinks: {
    type: Array as PropType<PageTabNavItem[]>,
    required: true,
  },
})
</script>

<template>
  <VTabs class="mb-3 v-tabs-pill" center-active>
    <VTab v-for="link in navLinks" :key="link.title" :to="link.to" active-class="active">
      {{ link.title }}
    </VTab>
  </VTabs>
</template>
