<script setup lang="ts">
import { PAYMENT_STATUSES } from '@/constants/subscriptions'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { listService } from '@/services/ListService'
import { useAuthStore } from '@/stores/AuthStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type {
  SubscriptionsRequestEditModalProps,
  SubscriptionsRequestStatus,
} from '../interfaces/SubscriptionsRequests'
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
const { hasPermission } = useAuthStore()
const isLoading = reactive({
  submit: false,
  periods: false,
  packages: false,
})
const formRef = ref<any>(null)
const periodsList = ref([])
const packagesList = ref([])

const tomorrowDate = ref(new Date())
tomorrowDate.value.setDate(tomorrowDate.value.getDate() + 1)

const formData = reactive<SubscriptionsRequestEditModalProps>({
  payment_status: null,
  request_status: null,
  new_request_status: null,
  stopped_from: null,
  stopped_until: null,
  free_days: null,
  package_id: null,
  period_id: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  accept: hasPermission('accept_subscription_request'),
  reject: hasPermission('reject_subscription_request'),
  activeTemp: hasPermission('active_temp_subscription_request'),
  activeOnce: hasPermission('active_once_subscription_request'),
  stopTemp: hasPermission('stop_temp_subscription_request'),
  vacation: hasPermission('vacation_subscription_request'),
  renew: hasPermission('renew_subscription_request'),
  extend: hasPermission('extend_subscription_request'),
  promote: hasPermission('promote_subscription_request'),
}))

const requestStatuses = computed((): SubscriptionsRequestStatus[] => {
  return [
    {
      value: 'Accept',
      label: 'قبول',
      show: [1, 3].includes(formData.request_status) && permissions.value.accept,
    },
    {
      value: 'Reject',
      label: 'رفض',
      show: formData.request_status === 1 && permissions.value.reject,
    },
    {
      value: 'StopTemp',
      label: 'موقوف مؤقتا',
      show: [2, 4].includes(formData.request_status) && permissions.value.stopTemp,
    },
    {
      value: 'Extend',
      label: 'تمديد الإشتراك',
      show: formData.request_status === 2 && permissions.value.extend,
    },
    {
      value: 'ActiveTemp',
      label: 'منح فترة مجانية',
      show: [2, 4, 6].includes(formData.request_status) && permissions.value.activeTemp,
    },
    {
      value: 'Vacation',
      label: 'عمل أجازة',
      show: formData.request_status === 2 && permissions.value.vacation,
    },
    {
      value: 'Promotion',
      label: 'ترقية',
      show: [4, 6].includes(formData.request_status) && permissions.value.promote,
    },
    {
      value: 'Renew',
      label: 'تجديد الاشتراك',
      show: formData.request_status === 6 && permissions.value.renew,
    },
    {
      value: 'ActiveOnce',
      label: 'تنشيط مرة واحدة',
      show: formData.request_status === 6 && permissions.value.activeOnce,
    },
    {
      value: 'Activate',
      label: 'تنشيط',
      show: formData.request_status === 5,
    },
  ]
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))

// #endregion
function edit() {
  isLoading.submit = true
  subscriptionsRequestsService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    edit()
  })
}

function getPackages() {
  isLoading.packages = true
  listService
    .getPackagesLists()
    .then((res) => {
      packagesList.value = res.data.data
    })
    .finally(() => {
      isLoading.packages = false
    })
}

function getPackagePeriods() {
  if (!formData.package_id) return
  formData.period_id = null
  isLoading.periods = true
  listService
    .getPackagePeriods(formData.package_id)
    .then((res) => {
      periodsList.value = res.data.data
    })
    .finally(() => {
      isLoading.periods = false
    })
}

function onChangePackage() {
  formData.period_id = null
  getPackagePeriods()
}

function onChangeRequestStatus() {
  if (!formData.new_request_status) return
  if (['Renew', 'Extend', 'Promotion'].includes(formData.new_request_status)) {
    getPackagePeriods()
  }
  if (formData.new_request_status === 'Promotion') {
    getPackages()
  }
}
</script>

<template>
  <VDialog v-model="showModal" max-width="650" persistent scrollable class="form-modal">
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
                  v-model="formData.new_request_status"
                  :items="requestStatuses.filter((item) => item.show)"
                  item-title="label"
                  item-value="value"
                  name="new_request_status"
                  label="حالة الطلب"
                  clearable
                  rules="required"
                  @update:modelValue="onChangeRequestStatus"
                >
                </AppSelect>
              </VCol>
              <template v-if="![null, 'Accept', 'Reject'].includes(formData.new_request_status)">
                <template v-if="['Vacation', 'StopTemp'].includes(formData.new_request_status)">
                  <VCol cols="12" sm="6">
                    <VeeField
                      v-slot="{ errorMessage, value, handleChange }"
                      v-model="formData.stopped_from"
                      name="stopped_from"
                      label="تاريخ بداية الايقاف"
                      rules="required"
                    >
                      <AppDateTimePicker
                        label="تاريخ بداية الايقاف"
                        :model-value="value"
                        :error-msg="errorMessage"
                        clearable
                        prepend-inner-icon="tabler-calendar"
                        :config="{ disableMobile: true, minDate: tomorrowDate }"
                        @update:model-value="handleChange"
                      />
                    </VeeField>
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VeeField
                      v-slot="{ errorMessage, value, handleChange }"
                      v-model="formData.stopped_until"
                      name="stopped_until"
                      label="تاريخ نهاية الايقاف"
                      :rules="{ required: true, minDate: formData.stopped_from }"
                    >
                      <AppDateTimePicker
                        label="تاريخ نهاية الايقاف"
                        :key="formData.stopped_from"
                        :model-value="value"
                        :error-msg="errorMessage"
                        clearable
                        prepend-inner-icon="tabler-calendar"
                        :config="{
                          disableMobile: true,
                          minDate: formData.stopped_from
                            ? new Date(formData.stopped_from)
                            : tomorrowDate,
                        }"
                        @update:model-value="handleChange"
                      />
                    </VeeField>
                  </VCol>
                </template>
                <VCol
                  cols="12"
                  v-if="['ActiveTemp', 'ActiveOnce'].includes(formData.new_request_status)"
                >
                  <AppTextField
                    v-model="formData.free_days"
                    label="عدد الايام"
                    name="free_days"
                    type="number"
                    rules="required|numeric|min_value:1"
                  >
                    <template #append-inner> يوم </template></AppTextField
                  >
                </VCol>
                <VCol cols="12" v-if="formData.new_request_status === 'Promotion'">
                  <AppSelect
                    v-model="formData.package_id"
                    :items="packagesList"
                    item-title="label"
                    item-value="id"
                    name="package_id"
                    label="الباقة"
                    clearable
                    rules="required"
                    @update:modelValue="onChangePackage"
                    :loading="isLoading.packages"
                    :disabled="isLoading.packages"
                  />
                </VCol>
                <VCol
                  cols="12"
                  v-if="['Renew', 'Extend', 'Promotion'].includes(formData.new_request_status)"
                >
                  <AppSelect
                    v-model="formData.period_id"
                    :items="periodsList"
                    item-title="label"
                    item-value="id"
                    name="period_id"
                    label="المدة"
                    clearable
                    rules="required"
                    :loading="isLoading.periods"
                    :disabled="isLoading.periods || !formData.package_id"
                  />
                </VCol>
              </template>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || !meta.valid"
              @click="submit"
            >
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
