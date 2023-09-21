<script setup lang="ts">
import { sharedService } from '@/services/SharedService'
import { useToast } from 'vue-toastification'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface ToggleActivationSwitchProps {
  modelValue: boolean
  model: string
  id: number
  disabled?: boolean
  column?: string | null
}

const props = withDefaults(defineProps<ToggleActivationSwitchProps>(), {
  column: null,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
const toast = useToast()
const isLoading = ref<boolean>(false)

// #region Variables

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const switchValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function toggleActivation() {
  isLoading.value = true

  const payload: any = {
    id: props.id,
    model: props.model,
  }
  if (props.column) payload.column = props.column

  sharedService
    .toggleActivation(payload)
    .then((res) => {
      toast.success(res.data.message)
    })
    .catch(() => {
      switchValue.value = !switchValue.value
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <VSwitch
    v-model="switchValue"
    hide-details
    v-bind="$attrs"
    :loading="isLoading"
    :disabled="isLoading || disabled"
    density="comfortable"
    :inset="false"
    @click="toggleActivation"
  />
</template>
