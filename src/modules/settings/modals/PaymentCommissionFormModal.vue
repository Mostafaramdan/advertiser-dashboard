<script setup lang="ts">
import { cloneItem } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { PaymentCommission, PaymentCommissionBase } from '../interfaces/PaymentCommission'
import { paymentCommissionService } from '../services/PaymentCommissionService'

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
  (e: 'createItem', value: PaymentCommission): void
  (e: 'editItem', value: PaymentCommission): void
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

const formData = reactive<PaymentCommission | PaymentCommissionBase>({
  name: '',
  minimum: null,
  maximum: null,
  value_in_platform: null,
  value_out_platform: null,
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة شريحة'
    : props.formAction === 'edit'
      ? 'تعديل شريحة'
      : 'عرض شريحة'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function edit() {
  paymentCommissionService
    .editItem(formData as PaymentCommission)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData as PaymentCommission)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  paymentCommissionService
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
                <AppTextField
                  v-model="formData.name"
                  label="اسم الشريحة"
                  name="name"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model.number="formData.minimum"
                  label="الحد الادنى للشريحة"
                  name="minimum"
                  rules="required|numeric"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model.number="formData.maximum"
                  label="الحد الاعلي للشريحة"
                  name="maximum"
                  :rules="{ required: true, numeric: true, min_value: formData.minimum }"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model.number="formData.value_in_platform"
                  label="نسبة العمولة داخل المنصة"
                  name="value_in_platform"
                  rules="required|numeric|max_value:100"
                  type="number"
                >
                  <template #append-inner> % </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model.number="formData.value_out_platform"
                  label="نسبة العمولة خارج المنصة"
                  name="value_out_platform"
                  rules="required|numeric|max_value:100"
                  type="number"
                >
                  <template #append-inner> % </template>
                </AppTextField>
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
