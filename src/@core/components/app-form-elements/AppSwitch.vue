<script lang="ts" setup>
import type { FormSwitchProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormSwitchProps>(), {
  rules: '',
  hideLabel: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})

// #endregion
</script>

<template>
  <VeeField
    v-slot="{ handleChange, errorMessage }"
    v-model="value"
    :name="name"
    :label="label"
    :rules="rules"
    class="app-checkbox flex-grow-1"
  >
    <VLabel
      v-if="!hideLabel"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <VSwitch
      v-bind="$attrs"
      :inset="false"
      :model-value="value"
      :error="!!errorMessage"
      @update:model-value="handleChange"
    />

    <AppErrorMessage :error-message="errorMessage" />
  </VeeField>
</template>
