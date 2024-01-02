<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
})
</script>

<template>
  <VAlert :text="text" :color="color" border="start" variant="tonal" density="compact" />
</template>
