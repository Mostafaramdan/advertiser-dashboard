<script setup lang="ts">
const { locale } = useI18n()

defineProps({
  link: {
    type: [String, Object],
  },
})
</script>

<template>
  <VBtn variant="tonal" size="40" rounded="sm" :to="link" class="me-3">
    <VIcon :icon="`tabler-arrow-${locale === 'ar' ? 'right' : 'left'}`" size="22" />
  </VBtn>
</template>
