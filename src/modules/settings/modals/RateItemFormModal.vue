<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { RateItem } from '../interfaces/RateItem'
import { rateItemsService } from '../services/RateItemsService'
import type { FormModalProps } from '@/interfaces/Forms'
import { getOptionsArrayFromObject } from '@/helpers/index'
import { RATE_ITEM_TARGETS, RATE_ITEM_TYPES, RATE_ITEM_WAYS } from '@/constants/settings'

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
  (e: 'createItem', value: RateItem): void
  (e: 'editItem', value: RateItem): void
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

const formData = reactive<RateItem>({
  name: {
    ar: '',
    en: '',
  },
  answers: [],
  points: null,
  for: 'advertiser',
  way: 'straight',
  type: 'positive',
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة تقييم'
    : props.formAction === 'edit' ? 'تعديل تقييم' : 'عرض تقييم'
})

const isDisabled = computed(() => {
  return isLoading.submit || isLoading.data || (formData.way === 'question' && !formData.answers?.length)
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem?.id) {
  Object.assign(formData, props.activeItem)
  getItemDetails(props.activeItem.id)
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.data = true
  rateItemsService.getSingleItem(id).then(res => {
    Object.assign(formData, res.data.data)
  }).finally(() => {
    isLoading.data = false
  })
}

function initAnswers() {
  if (formData.way === 'question' && !formData.answers?.length)
    formData.answers = [{ answer: { ar: '', en: '' }, points: null }]
}

function edit() {
  rateItemsService.editItem(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', formData)
    showModal.value = false
  }).finally(() => {
    isLoading.submit = false
  })
}

function create() {
  rateItemsService.createItem(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data)
    showModal.value = false
  }).finally(() => {
    isLoading.submit = false
  })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid)
      return

    isLoading.submit = true
    if (formData.way === 'straight')
      delete formData.answers
    else
      delete formData.points

    props.formAction === 'create' ? create() : edit()
  })
}

// #endregion
</script>

<template>
  <VDialog
    v-model="showModal"
    max-width="800"
    persistent
    scrollable
    class="form-modal"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading.data">
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="formData.name.ar"
                  label="اسم التقييم بالعربي"
                  name="name.ar"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="formData.name.en"
                  label="اسم التقييم بالانجليزي"
                  name="name.en"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12" sm="6" class="pb-0">
                <AppRadio
                  v-model="formData.type"
                  :options="getOptionsArrayFromObject(RATE_ITEM_TYPES)"
                  name="type"
                  label="النوع"
                  rules="required"
                  option-label="label"
                  option-value="value"
                  inline
                />
              </VCol>
              <VCol cols="12" sm="6" class="pb-0">
                <AppRadio
                  v-model="formData.for"
                  :options="getOptionsArrayFromObject(RATE_ITEM_TARGETS)"
                  name="for"
                  label="المستهدف"
                  rules="required"
                  option-label="label"
                  option-value="value"
                  inline
                />
              </VCol>
              <VCol cols="12" sm="6" class="pb-0">
                <AppRadio
                  v-model="formData.way"
                  :options="getOptionsArrayFromObject(RATE_ITEM_WAYS)"
                  name="way"
                  label="الطريقة"
                  rules="required"
                  option-label="label"
                  option-value="value"
                  inline
                  @update:model-value="initAnswers"
                />
              </VCol>
              <VCol cols="12" sm="6" class="pb-0">
                <AppSwitch
                  v-model="formData.is_active"
                  label="الحالة"
                  name="is_active"
                />
              </VCol>
              <VCol v-if="formData.way === 'straight'" cols="12">
                <AppTextField
                  v-model="formData.points"
                  label="نقاط التقييم"
                  name="points"
                  type="number"
                  :max="5"
                  rules="required|min_value:1|max_value:5"
                />
              </VCol>
              <VCol v-else-if="formData.way === 'question'" cols="12">
                <label class="v-label text-body-2 text-high-emphasis mb-5 d-block">الاجابات</label>
                <VRow v-for="(answer, index) in formData.answers" :key="index" class="border mx-0 answer-card py-1 px-2">
                  <VCol cols="12" md="4" class="px-1">
                    <AppTextField
                      v-model="answer.answer.ar"
                      label="الإجابة بالعربي"
                      hide-default-label
                      :name="`answers-ar-[${index}]`"
                      rules="required|min:3"
                    />
                  </VCol>
                  <VCol cols="12" md="4" class="px-1">
                    <AppTextField
                      v-model="answer.answer.en"
                      label="الإجابة بالانجليزي"
                      hide-default-label
                      :name="`answers-en-[${index}]`"
                      rules="required|min:3"
                    />
                  </VCol>
                  <VCol cols="12" md="4" class="px-1">
                    <AppTextField
                      v-model="answer.points"
                      label="النقاط"
                      hide-default-label
                      :name="`points-[${index}]`"
                      type="number"
                      :max="5"
                      rules="required|min_value:1|max_value:5"
                    />
                  </VCol>
                  <VBtn
                    icon
                    color="error"
                    size="30"
                    class="answer-card__delete-btn"
                    @click="formData.answers?.splice(index, 1)"
                  >
                    <VIcon icon="tabler-trash" />
                  </VBtn>
                </VRow>
                <VBtn
                  v-if="formData.answers && formData.answers.length < 5"
                  variant="outlined"
                  @click="formData.answers.push({ answer: { ar: '', en: '' }, points: null })"
                >
                  اضافة اجابة
                  <VIcon end icon="tabler-plus" />
                </VBtn>
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
            <VBtn :loading="isLoading.submit" :disabled="isDisabled || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.answer-card {
  position: relative;

  &:not(:last-of-type) {
    margin-block-end: 20px;
  }

  &:last-of-type {
    margin-block-end: 10px;
  }

  &__delete-btn {
    position: absolute;
    inset-block-start: -13px;
    inset-inline-end: -13px;
  }
}
</style>
