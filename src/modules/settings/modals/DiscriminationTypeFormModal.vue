<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { DiscriminationType } from '../interfaces/DiscriminationType'
import { discriminationTypeService } from '../services/DiscriminationTypeService'
import type { File } from '@/interfaces/Shared'
import type { FormModalProps } from '@/interfaces/Forms'
import { cloneItem } from '@/helpers/index'

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
  (e: 'createItem', value: DiscriminationType): void
  (e: 'editItem', value: DiscriminationType): void
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

const formData = reactive<DiscriminationType>({
  name: {
    ar: '',
    en: '',
  },
  is_active: true,
  image: null,
  image_id: null,
  minimum: null,
  maximum: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة تمييز'
    : props.formAction === 'edit' ? 'تعديل تمييز' : 'عرض تمييز'
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
  discriminationTypeService.editItem(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', formData)
    showModal.value = false
  }).finally(() => {
    isLoading.value = false
  })
}

function create() {
  discriminationTypeService.createItem(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data)
    showModal.value = false
  }).finally(() => {
    isLoading.value = false
  })
}

function updateImageId(image: File) {
  if (image) formData.image_id = image.id
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
                <AppUploadFile
                  v-model="formData.image"
                  name="image"
                  label="صورة التمييز"
                  rules="required"
                  :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                  width="150px"
                  height="120px"
                  @update:model-value="updateImageId"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name.ar"
                  label="اسم التمييز بالعربي"
                  name="name.ar"
                  rules="required|min:3|max:20"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name.en"
                  label="اسم التمييز بالانجليزي"
                  name="name.en"
                  rules="required|min:3|max:20"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.minimum"
                  label="الحد الادني للشريحة"
                  name="minimum"
                  type="number"
                  :max="100"
                  rules="required|numeric"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.maximum"
                  label="الحد الاعلي للشريحة"
                  name="maximum"
                  type="number"
                  :max="100"
                  :rules="{ required: true, numeric: true, min_value: formData.minimum }"
                />
              </VCol>
              <VCol cols="12" class="pt-0">
                <AppSwitch
                  v-model="formData.is_active"
                  label="الحالة"
                  name="is_active"
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
