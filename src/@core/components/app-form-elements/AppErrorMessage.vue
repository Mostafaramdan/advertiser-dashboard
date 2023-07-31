<script setup lang="ts">
defineProps({
  errorMessage: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div v-if="errorMessage" class="v-text-field v-input--error">
    <div class="v-input__details">
      <div class="v-messages">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
