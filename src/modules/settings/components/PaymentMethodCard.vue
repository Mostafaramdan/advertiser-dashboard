<script setup lang="ts">
import type { PaymentGetWay, PaymentMethod } from '../interfaces/PlatformDetails'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { PAYMENT_GET_WAYS } from '@/constants/settings'
import { useAuthStore } from '@/stores/AuthStore'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface FormModalProps {
  payment: PaymentMethod
  gateway: PaymentGetWay
}
const props = withDefaults(defineProps<FormModalProps>(), {})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'confirmDelete', value: PaymentMethod): void
  (e: 'showEditModal', value: PaymentMethod): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const { getImageUrl } = UseGeneralHelpers()
const MODEL_NAME = 'billing_cards'

const cardStatus = ref(props.payment.is_active)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  edit: hasPermission('update_billing_card'),
  delete: hasPermission('delete_billing_card'),
  changeStatus: hasPermission('change_status_billing_card'),
}))

// #endregion
</script>

<template>
  <VCard class="payment-card pa-3" variant="outlined">
    <div class="d-flex align-center gap-3 mb-3">
      <ToggleActivationSwitch
        v-if="payment.id"
        :id="payment.id"
        v-model="cardStatus"
        :model="MODEL_NAME"
        class="me-auto ms-2"
        :disabled="!permissions.changeStatus"
      />
      <VBtn v-if="permissions.edit" size="33" variant="outlined" @click="emit('showEditModal', payment)">
        <VIcon
          icon="tabler-edit"
          size="18"
        />
      </VBtn>
      <VBtn
        v-if="permissions.delete"
        size="33"
        variant="outlined"
        color="error"
        @click="emit('confirmDelete', payment)"
      >
        <VIcon
          icon="tabler-trash"
          size="18"
        />
      </VBtn>
    </div>
    <div class="payment-card__row">
      <VAvatar size="60" variant="outlined">
        <VImg :src="getImageUrl(`svg/payments-icons/${gateway}.svg`)" />
      </VAvatar>
      <div class="payment-card__body">
        <template v-if="gateway === PAYMENT_GET_WAYS.bank">
          <h2 class="text-h6">
            {{ payment.bank_username }}
          </h2>
          <p class="text-body-2 mb-0">
            {{ payment.iban }}
          </p>
        </template>
        <template v-else-if="gateway === PAYMENT_GET_WAYS.card">
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              رقم البطاقة
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.card_number }}
            </p>
          </div>
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              تاريخ الإنتهاء
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.expiration_date }}
            </p>
          </div>
        </template>
        <template v-else-if="gateway === PAYMENT_GET_WAYS.apple_pay">
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              اسم المستخدم
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.card_username }}
            </p>
          </div>
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              رقم كلود
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.icloud }}
            </p>
          </div>
        </template>
        <template v-else-if="gateway === PAYMENT_GET_WAYS.stc_pay">
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              اسم المستخدم
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.card_username }}
            </p>
          </div>
          <div class="d-flex flex-wrap justify-between">
            <h2 class="text-h6 me-3 min-w-80">
              رقم الجوال
            </h2>
            <p class="text-body-2 mb-0">
              {{ payment.phone }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </VCard>
</template>

<style lang="scss" scoped>
.payment-card {
  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__body {
    flex-basis: calc(100% - 70px);
    word-break: break-word;

    .min-w-80 {
      min-inline-size: 90px;
      white-space: nowrap;
    }
  }
}
</style>
