<script setup lang="ts">
import { REPLIES_TYPES } from '@/constants/settings'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { ReadyReply, ReadyReplyBase } from '../interfaces/ReadyReply'
import { offersReadyRepliesService } from '../services/OffersReadyRepliesService'

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
  (e: 'createItem', value: ReadyReply): void
  (e: 'editItem', value: ReadyReply): void
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

const formData = reactive<ReadyReply | ReadyReplyBase>({
  reply: '',
  types: [],
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة رد'
    : props.formAction === 'edit'
      ? 'تعديل رد'
      : 'عرض رد'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem?.id) {
  Object.assign(formData, { ...cloneItem(props.activeItem) })
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function edit() {
  offersReadyRepliesService
    .editItem(formData as ReadyReply)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData as ReadyReply)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  offersReadyRepliesService
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

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.value = true
    props.formAction === 'create' ? create() : edit()
  })
}

// #endregion
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
                <AppTextarea
                  v-model="formData.reply"
                  name="reply"
                  label="نص الرد"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
              <VCol cols="12" class="pb-0">
                <AppCheckbox
                  v-model="formData.types"
                  :options="getOptionsArrayFromObject(REPLIES_TYPES)"
                  name="types"
                  label="النوع"
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
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
