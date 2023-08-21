<script setup lang="ts">
import { listService } from '@/services/ListService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ modelValue: any }>(), {
  modelValue: null,
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
// #region Variables
const questionsCategories = ref([])
const isLoading = ref(false)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const value = computed({
  get() {
    return isLoading.value ? null : props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getQuestionsCategoriesList()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getQuestionsCategoriesList() {
  isLoading.value = true
  listService.getQuestionsCategories().then(res => {
    questionsCategories.value = res.data.data
  }).finally(() => {
    isLoading.value = false
  })
}

// #endregion
</script>

<template>
  <AppSelect
    v-model="value"
    :disabled="isLoading"
    :loading="isLoading"
    :items="questionsCategories"
    label="القسم"
    item-title="name"
    item-value="id"
    name="category"
    clearable
    v-bind="$attrs"
  />
</template>
