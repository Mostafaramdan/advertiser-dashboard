<script setup lang="ts">
import { DropdownMenuItem } from '@/interfaces/Shared'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type {
  ExchangeRecordFormData,
  ExchangeRecordWithdrawData,
} from '../interfaces/ExchangeRecord'
import { exchangeRecordsService } from '../services/ExchangeRecordsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem'): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<any>(null)
const requestsList = ref<DropdownMenuItem[]>([])
const bankAccountsList = ref<DropdownMenuItem[]>([])
const withdrawData = ref<ExchangeRecordWithdrawData | null>(null)

const isLoading = reactive({
  data: false,
  requests: false,
  submit: false,
})
const formData = reactive<ExchangeRecordFormData>({
  user_id: null,
  payment_amount: null,
  request_id: null,
  billing_card_id: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const withdrawInfo = computed(() => {
  if (!withdrawData.value) []
  else {
    const { total_balance, wallet, available_withdraw, pending_balance, request_total } =
      withdrawData.value
    return [
      {
        label: 'الرصيد التراكمي',
        value: total_balance,
      },
      {
        label: 'رصيد المحفظة',
        value: wallet,
      },
      {
        label: 'الرصيد القابل للسحب',
        value: available_withdraw,
      },
      {
        label: 'الرصيد المعلق',
        value: pending_balance,
      },
      {
        label: 'قيمة الطلب',
        value: request_total,
      },
    ]
  }
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getFormData() {
  if (!formData.user_id) return
  isLoading.data = true
  exchangeRecordsService
    .getWithdrawData(formData.user_id)
    .then((res) => {
      const { bank_accounts, counters } = res.data
      bankAccountsList.value = bank_accounts
      withdrawData.value = counters
    })
    .finally(() => {
      isLoading.data = false
    })
}

function onChangeUser() {
  formData.request_id = null
  formData.billing_card_id = null
  getFormData()
}

function create() {
  exchangeRecordsService
    .createWithdrawRequest(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem')
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
    create()
  })
}
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="800" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading.data">
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="انشاء صرف عمولة مستحقة">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange, handleBlur }"
                  v-model="formData.user_id"
                  name="user_id"
                  label="المستخدم"
                  rules="required"
                  @update:model-value="onChangeUser"
                >
                  <VLabel class="text-body-2 text-high-emphasis" text="المستخدم" />
                  <UsersSelectFilter
                    label=""
                    :userRole="null"
                    :model-value="value"
                    :error-messages="errorMessage"
                    :error="!!errorMessage"
                    id="users-select-filter"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    clearable
                  />
                </VeeField>
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.request_id"
                  :items="requestsList"
                  item-title="label"
                  item-value="id"
                  name="request_id"
                  label="رقم الطلب"
                  clearable
                  rules="required"
                  :disabled="!formData.user_id"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.billing_card_id"
                  :items="bankAccountsList"
                  item-title="label"
                  item-value="id"
                  name="billing_card_id"
                  label="الحساب"
                  clearable
                  rules="required"
                  :disabled="!formData.user_id"
                />
              </VCol>
              <VCol cols="12" v-if="formData.user_id">
                <div class="border pa-2">
                  <h2 class="text-h6 mb-4">بيانات المستخدم</h2>
                  <div class="information-list">
                    <VRow>
                      <VCol
                        v-for="(item, index) in withdrawInfo"
                        :key="index"
                        class="py-2 information-list__item"
                        cols="12"
                        sm="6"
                        lg="4"
                      >
                        <h5 class="text-primary text-subtitle-2">
                          {{ item.label }}
                        </h5>
                        <p class="text-body-2 mb-0">
                          {{ item.value ?? '-' }}
                        </p>
                      </VCol>
                    </VRow>
                  </div>
                </div>
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.payment_amount"
                  label="مبلغ الصرف"
                  name="payment_amount"
                  rules="required|numeric|min_value:1"
                />
              </VCol>
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
