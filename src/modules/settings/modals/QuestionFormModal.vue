<script setup lang="ts">
import { USERS_TYPES } from '@/constants/settings'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import QuestionsCategoriesSelect from '../components/QuestionsCategoriesSelect.vue'
import type { Question, QuestionBase } from '../interfaces/Question'
import { questionsService } from '../services/QuestionsService'

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
  (e: 'createItem', value: Question): void
  (e: 'editItem', value: Question): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)

const isLoading = reactive({
  data: false,
  submit: false,
})

const formRef = ref<any>(null)
const categoriesSelectRef = ref()

const formData = reactive<Question | QuestionBase>({
  question: '',
  answer: '',
  category_id: null,
  for: [],
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة سؤال'
    : props.formAction === 'edit'
      ? 'تعديل سؤال'
      : 'عرض سؤال'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks

if (props.activeItem?.id) {
  Object.assign(formData, {
    ...cloneItem(props.activeItem),
    category_id: props.activeItem.category.id,
  })
  getItemDetails(props.activeItem.id)
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.data = true
  questionsService
    .getSingleItem(id)
    .then((res) => {
      const response = res.data.data

      Object.assign(formData, { ...response, category_id: props.activeItem.category.id })
    })
    .finally(() => {
      isLoading.data = false
    })
}

function edit() {
  questionsService
    .editItem(formData as Question)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create() {
  questionsService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
    props.formAction === 'create' ? create() : edit()
  })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="1000" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading.data">
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.question"
                  label="السؤال"
                  name="question"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12" md="6">
                <div ref="categoriesSelectRef" class="categories-select">
                  <QuestionsCategoriesSelect
                    v-model="formData.category_id"
                    label="القسم"
                    name="category_id"
                    rules="required"
                    :menu-props="{
                      attach: categoriesSelectRef,
                      'location-strategy': 'static',
                    }"
                  />
                </div>
              </VCol>
              <VCol cols="12">
                <AppTextEditor
                  v-model="formData.answer"
                  label="الاجابة"
                  name="answer"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12" class="pb-0">
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
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || isLoading.data || !meta.valid"
              @click="submit"
            >
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.categories-select {
  position: relative;
  z-index: 1;

  :deep(.v-menu > .v-overlay__content) {
    inline-size: 100%;
    inset-block-start: 70px;
    inset-inline-start: 0;
  }
}
</style>
