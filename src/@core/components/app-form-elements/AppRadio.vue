<script lang="ts" setup>
import type { FormRadioProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormRadioProps>(), {
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
    <VRadioGroup
      :model-value="value"
      v-bind="$attrs"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      @update:model-value="handleChange"
    >
      <div>
        <VRadio
          v-for="(option, index) in options"
          :key="index"
          :label="option[optionLabel]"
          :value="option[optionValue]"
        />
      </div>
    </VRadioGroup>
  </VeeField>
</template>
