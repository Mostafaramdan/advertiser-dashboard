<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { QuestionCategory } from '../interfaces/QuestionCategory'
import { questionsCategoriesService } from '../services/QuestionsCategoriesService'
import type { FormModalProps } from '@/interfaces/Forms'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import { USERS_TYPES } from '@/constants/settings'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: QuestionCategory): void
  (e: 'editItem', value: QuestionCategory): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)

const formData = reactive({
  name: '',
  for: [],
  blocked_at: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة قسم'
    : props.formAction === 'edit' ? 'تعديل قسم' : 'عرض قسم'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem)
  Object.assign(formData, cloneItem(props.activeItem))

// #endregion
function edit() {
  questionsCategoriesService.editItem(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', formData)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
  })
}

function create() {
  questionsCategoriesService.createItem(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
  })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid)
      return

    isLoading.value = true
    props.formAction === 'create' ? create() : edit()
  })
}
</script>

<template>
  <VDialog
    v-model="showModal"
    max-width="600"
    persistent
    scrollable
    class="form-modal"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.name"
                  label="الاسم"
                  name="name"
                  rules="required|min:3"
                />
              </VCol>
              <VCol>
                <AppCheckbox
                  v-model="formData.for"
                  :options="getOptionsArrayFromObject(USERS_TYPES)"
                  name="type"
                  label="نوع المستخدمين"
                  rules="required"
                  option-label="label"
                  option-value="value"
                />
              </VCol>
              <VCol cols="12">
                <AppSwitch
                  v-model="formData.blocked_at"
                  label="الحالة"
                  name="blocked_at"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="outlined"
              color="error"
              @click="showModal = false"
            >
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
