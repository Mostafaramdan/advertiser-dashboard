<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { PlatformNewsItem } from '../interfaces/PlatformNewsItem'
import { platformNewsService } from '../services/PlatformNewsService'
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
  (e: 'createItem', value: PlatformNewsItem): void
  (e: 'editItem', value: PlatformNewsItem): void
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

const formData = reactive<PlatformNewsItem>({
  name: '',
  description: '',
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
    ? 'اضافة خبر'
    : props.formAction === 'edit'
    ? 'تعديل خبر'
    : 'عرض خبر'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem?.id) {
  Object.assign(formData, { ...cloneItem(props.activeItem) })
  getItemDetails(props.activeItem.id)
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.data = true
  platformNewsService
    .getSingleItem(id)
    .then((res) => {
      const response = res.data.data

      Object.assign(formData, { ...response })
    })
    .finally(() => {
      isLoading.data = false
    })
}
function edit() {
  platformNewsService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)

      // emit('editItem', res.data)
      emit('editItem', formData)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create() {
  platformNewsService
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
              <VCol cols="12">
                <AppTextField
                  v-model="formData.name"
                  label="العنوان"
                  name="name"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12" class="pb-0">
                <AppCheckbox
                  v-model="formData.for"
                  :options="getOptionsArrayFromObject(USERS_TYPES)"
                  name="for"
                  label="نوع المستخدمين"
                  rules="required"
                  option-label="label"
                  option-value="value"
                />
              </VCol>
              <VCol cols="12">
                <AppTextEditor
                  v-model="formData.description"
                  label="الوصف"
                  name="description"
                  rules="required|min:3"
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
              :disabled="isLoading.data || isLoading.submit || !meta.valid"
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
