<script setup lang="ts">
const fromDate = defineModel<any>('fromDate')
const toDate = defineModel<any>('toDate')
</script>

<template>
  <div class="mb-3">
    <VeeField
      v-slot="{ errorMessage, value, handleChange }"
      v-model="fromDate"
      name="fromDate"
      label="تاريخ البداية"
    >
      <AppDateTimePicker
        label="تاريخ البداية"
        placeholder="تاريخ البداية"
        :model-value="value"
        :error-msg="errorMessage"
        clearable
        prepend-inner-icon="tabler-calendar"
        :config="{
          disableMobile: true,
          maxDate: new Date(),
        }"
        @update:model-value="handleChange"
        hide-label
      />
    </VeeField>
  </div>
  <div>
    <VeeField
      v-slot="{ errorMessage, value, handleChange }"
      v-model="toDate"
      name="toDate"
      label="تاريخ النهاية"
      :rules="{ minDate: fromDate }"
    >
      <AppDateTimePicker
        label="تاريخ النهاية"
        placeholder="تاريخ النهاية"
        :model-value="value"
        :error-msg="errorMessage"
        clearable
        prepend-inner-icon="tabler-calendar"
        :config="{
          disableMobile: true,
          maxDate: new Date(),
          minDate: fromDate ? new Date(fromDate) : null,
        }"
        @update:model-value="handleChange"
        hide-label
      />
    </VeeField>
  </div>
</template>
