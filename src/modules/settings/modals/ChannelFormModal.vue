<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Channel } from '../interfaces/Channel'
import { channelsService } from '../services/ChannelsService'
import { CHANNEL_TYPES } from '@/constants/settings'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'

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
  (e: 'createItem', value: Channel): void
  (e: 'editItem', value: Channel): void
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

const formData = reactive<Channel>({
  name: {
    ar: '',
    en: '',
  },
  is_active: true,
  channel_type: null,
  image: null,
  image_id: null,
  followers_percentage: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة قناة'
    : props.formAction === 'edit' ? 'تعديل قناة' : 'عرض قناة'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) {
  Object.assign(formData, cloneItem(props.activeItem))
  formData.channel_type = formData.channel_type?.toString() as any || null
}

// #endregion
function edit() {
  channelsService.editItem(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', formData)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
  })
}

function create() {
  channelsService.createItem(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
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
                  label="صورة القناة"
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
                  label="اسم القناة بالعربي"
                  name="name.ar"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name.en"
                  label="اسم القناة بالانجليزي"
                  name="name.en"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.followers_percentage"
                  label="نسبة المتابعين"
                  name="followers_percentage"
                  type="number"
                  :max="100"
                  rules="required|min_value:0|max_value:100"
                />
              </VCol>
              <VCol>
                <AppRadio
                  v-model="formData.channel_type"
                  :options="getOptionsArrayFromObject(CHANNEL_TYPES)"
                  name="channel_type"
                  label="النوع"
                  rules="required"
                  option-label="label"
                  option-value="value"
                  inline
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
