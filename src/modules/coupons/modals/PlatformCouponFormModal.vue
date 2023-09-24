<script setup lang="ts">
import { COUPONS_TYPES } from '@/constants/coupons'
import { cloneItem } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { PlatformCoupon } from '../interfaces/PlatformCoupon'
import { couponsService } from '../services/CouponsService'

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
  (e: 'createItem', value: PlatformCoupon): void
  (e: 'editItem', value: PlatformCoupon): void
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

const formData = reactive<PlatformCoupon>({
  code: '',
  is_active: true,
  image: null,
  image_id: null,
  discount: null,
  marketer_ratio: null,
  uses: null,
  started_at: '',
  ended_at: '',
  description: '',
  type: COUPONS_TYPES.platform,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة كوبون'
    : props.formAction === 'edit'
    ? 'تعديل كوبون'
    : 'عرض كوبون'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) {
  Object.assign(formData, cloneItem(props.activeItem))
}

// #endregion
function edit() {
  couponsService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  couponsService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function updateImageId(image: File) {
  if (image) formData.image_id = image.id
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.value = true
    props.formAction === 'create' ? create() : edit()
  })
}
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppUploadFile
                  v-model="formData.image"
                  name="image"
                  label="صورة الكوبون"
                  rules="required"
                  :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                  width="150px"
                  height="120px"
                  @update:model-value="updateImageId"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.code"
                  label="كود الكوبون"
                  name="code"
                  rules="required|min:3|max:20"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.discount"
                  label="نسبة الخصم"
                  name="discount"
                  rules="required|numeric|min_value:0|max_value:100"
                  type="number"
                  :max="100"
                >
                  <template #append-inner> % </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" sm="6">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.started_at"
                  name="started_at"
                  label="تاريخ البداية"
                  rules="required"
                >
                  <AppDateTimePicker
                    label="تاريخ البداية"
                    :model-value="value"
                    :error-msg="errorMessage"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{ minDate: formAction === 'create' ? new Date() : null }"
                    @update:model-value="handleChange"
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" sm="6">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.ended_at"
                  name="ended_at"
                  label="تاريخ النهاية"
                  :rules="{ required: true, minDate: formData.started_at }"
                >
                  <AppDateTimePicker
                    label="تاريخ النهاية"
                    :key="formData.started_at"
                    :model-value="value"
                    :error-msg="errorMessage"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{
                      minDate: formData.started_at
                        ? new Date(formData.started_at)
                        : formAction === 'create'
                        ? new Date()
                        : null,
                    }"
                    @update:model-value="handleChange"
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.uses"
                  label="مرات الاستخدام"
                  name="uses"
                  rules="required|numeric|max_value:99999"
                  type="number"
                  :max="5"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.marketer_ratio"
                  label="نسبة تحمل المسوق"
                  name="marketer_ratio"
                  rules="required|numeric|min_value:0|max_value:100"
                  type="number"
                  :max="100"
                >
                  <template #append-inner> % </template></AppTextField
                >
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.description"
                  label="الوصف"
                  name="description"
                  rules="required|min:3|max:100"
                  rows="2"
                />
              </VCol>
              <VCol cols="12" class="pt-0">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
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
