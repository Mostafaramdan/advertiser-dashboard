<script lang="ts" setup>
import type { FormCheckboxProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormCheckboxProps>(), {
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
    <div class="demo-space-x">
      <VCheckbox
        v-for="(option, index) in options"
        :key="index"
        :label="option[optionLabel]"
        :value="option[optionValue]"
        :error="!!errorMessage"
        :model-value="value"
        @update:model-value="handleChange"
      />
    </div>
    <div v-if="errorMessage" class="v-input__details">
      <div class="v-messages">
        <div class="v-messages__message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </VeeField>
</template>
