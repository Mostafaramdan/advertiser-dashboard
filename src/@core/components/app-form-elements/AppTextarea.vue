<script lang="ts" setup>
import type { FormInputProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormInputProps>(), {
  rules: '',
})

// #endregion
/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

defineOptions({
  name: 'AppTextarea',
  inheritAttrs: false,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken
    ? `app-textarea-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}`
    : undefined
})

const label = computed(() => useAttrs().label as string | undefined)

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
    v-slot="{ handleChange, errorMessage, handleBlur }"
    v-model="value"
    class="app-textarea flex-grow-1"
    :class="$attrs.class"
    :name="name"
    :label="label"
    :rules="rules"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <VTextarea
      v-bind="{
        ...$attrs,
        class: null,
        label: undefined,
        variant: 'outlined',
        id: elementId,
      }"
      :model-value="value"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      @update:model-value="handleChange"
      @blur="handleBlur"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps || {}" />
      </template>
    </VTextarea>
  </VeeField>
</template>
