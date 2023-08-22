<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index'
import { useToast } from 'vue-toastification'
import type { PaymentMethod } from '../interfaces/PlatformDetails'
import { platformService } from '../services/PlatformService'
import type { FormModalProps } from '@/interfaces/Forms'
import { cloneItem } from '@/helpers/index'
import { PAYMENT_GET_WAYS } from '@/constants/settings'

import 'flatpickr/dist/plugins/monthSelect/style.css'

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
  (e: 'createItem', value: PaymentMethod): void
  (e: 'editItem', value: PaymentMethod): void
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
const paymentsGetWays = Object.entries(PAYMENT_GET_WAYS).map(([key, value]) => ({ value: key, label: t(`payment_methods.${value}`) }))

const platPickerConfig = {
  minDate: new Date(),
  plugins: ([
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    new monthSelectPlugin({ shorthand: true, dateFormat: 'y/m' }),
  ]),
}

const formData = reactive<PaymentMethod>({
  gateway: null,
  card_username: '',
  card_number: '',
  cvv: '',
  expiration_date: '',
  bank_name: '',
  bank_username: '',
  iban: '',
  icloud: '',
  phone: '',
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة طريقة دفع'
    : props.formAction === 'edit' ? 'تعديل طريقة دفع' : 'عرض طريقة دفع'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem)
  Object.assign(formData, cloneItem(props.activeItem))

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function edit() {
  platformService.editPaymentMethod(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', formData)
    showModal.value = false
  }).finally(() => {
    isLoading.value = false
  })
}

function create() {
  platformService.createPaymentMethod(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data.data)
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

// #endregion
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
                <AppSelect
                  v-model="formData.gateway"
                  :items="paymentsGetWays"
                  item-title="label"
                  item-value="value"
                  name="gateway"
                  label="بوابة الدفع"
                  clearable
                  rules="required"
                />
              </VCol>
              <template v-if="formData.gateway">
                <VCol v-if="formData.gateway !== PAYMENT_GET_WAYS.bank" cols="12">
                  <AppTextField
                    v-model="formData.card_username"
                    name="card_username"
                    :label="formData.gateway === PAYMENT_GET_WAYS.card ? 'اسم مستخدم البطاقة' : 'اسم المستخدم'"
                    rules="required|minWords:2"
                  />
                </VCol>
                <template v-if="formData.gateway === PAYMENT_GET_WAYS.card">
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.card_number"
                      name="card_number"
                      label="رقم البطاقة"
                      rules="required|numeric|min:14|max:14"
                      type="number"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="formData.cvv"
                      name="cvv"
                      label="cvv"
                      rules="required|numeric|min:3|max:3"
                      type="number"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <VeeField
                      v-slot="{ errorMessage, value, handleChange }"
                      v-model="formData.expiration_date"
                      name="expiration_date"
                      label="تاريخ الإنتهاء"
                      rules="required"
                    >
                      <AppDateTimePicker
                        label="تاريخ الإنتهاء"
                        :model-value="value"
                        :error-msg="errorMessage"
                        clearable
                        prepend-inner-icon="tabler-calendar"
                        :config="platPickerConfig"
                        @update:model-value="handleChange"
                      />
                    </VeeField>
                  </VCol>
                </template>
                <template v-else-if="formData.gateway === PAYMENT_GET_WAYS.bank">
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.bank_name"
                      name="bank_name"
                      label="اسم البنك"
                      rules="required|min:3"
                    />
                  </VCol>
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.bank_username"
                      name="bank_username"
                      label="اسم مستخدم البنك"
                      rules="required|minWords:4"
                    />
                  </VCol>
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.iban"
                      name="iban"
                      label="iban"
                      rules="required|min:21|max:30"
                    />
                  </VCol>
                </template>
                <template v-else-if="formData.gateway === PAYMENT_GET_WAYS.apple_pay">
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.icloud"
                      name="icloud"
                      label="icloud"
                      rules="required|validIcloud"
                    />
                  </VCol>
                </template>
                <template v-else-if="formData.gateway === PAYMENT_GET_WAYS.stc_pay">
                  <VCol cols="12">
                    <AppTextField
                      v-model="formData.phone"
                      name="phone"
                      label="الهاتف"
                      type="number"
                      rules="required|numeric|min:10|max:14"
                    />
                  </VCol>
                </template>
              </template>
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

<style lang="scss">

</style>
