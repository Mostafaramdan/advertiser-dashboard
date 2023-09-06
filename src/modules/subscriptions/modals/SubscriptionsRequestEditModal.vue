<script setup lang="ts">
import { PAYMENT_STATUSES } from '@/constants/subscriptions'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { subscriptionsRequestsService } from '../services/SubscriptionsRequestsService'

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
  (e: 'editItem', value: any): void
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

const formData = reactive<any>({
  payment_status: null,
  request_status: null,
  request_status_new: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const requestStatuses = computed(() => {
  return [
    {
      value: 'Accept',
      label: 'قبول',
      show: [1, 3, 4, 5].includes(formData.request_status),
    },
    {
      value: 'Reject',
      label: 'رفض',
      show: [1].includes(formData.request_status),
    },
    {
      value: 'StopTemp',
      label: 'موقوف مؤقتا',
      show: [2, 4].includes(formData.request_status),
    },
    {
      value: 'Extend',
      label: 'تمديد الإشتراك',
      show: [2].includes(formData.request_status),
    },
    {
      value: 'ActiveTemp',
      label: 'منح فترة مجانية',
      show: [2, 4, 6].includes(formData.request_status),
    },
    {
      value: 'Vacation',
      label: 'عمل أجازة',
      show: [2].includes(formData.request_status),
    },
    {
      value: 'Promotion',
      label: 'ترقية',
      show: [4, 6].includes(formData.request_status),
    },
    {
      value: 'Renew',
      label: 'تجديد الاشتراك',
      show: [6].includes(formData.request_status),
    },
    {
      value: 'activeOnce',
      label: 'تنشيط مرة واحدة',
      show: [6].includes(formData.request_status),
    },
  ].filter((item) => item.show)
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))

// #endregion
function edit() {
  subscriptionsRequestsService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)

      // emit('editItem', res.data)
      emit('editItem', formData)
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
    edit()
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
        <VCard title="تعديل الطلب">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.payment_status"
                  :items="getOptionsArrayFromObject(PAYMENT_STATUSES)"
                  item-title="label"
                  item-value="value"
                  name="payment_status"
                  label="حالة الدفع"
                  clearable
                  rules="required"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.request_status_new"
                  :items="requestStatuses"
                  item-title="label"
                  item-value="value"
                  name="request_status_new"
                  label="حالة الطلب"
                  clearable
                  rules="required"
                >
                </AppSelect>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
