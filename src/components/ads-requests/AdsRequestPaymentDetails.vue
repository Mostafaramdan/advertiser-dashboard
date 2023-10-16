<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { AdsRequestPaymentInfo, AdsRequestPlatformCommission } from '@/interfaces/AdsRequest'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    paymentDetails: AdsRequestPaymentInfo
    platformCommissionDetails: AdsRequestPlatformCommission
  }>(),
  {},
)

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDate } = UseGeneralHelpers()
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const paymentInfo = computed(() => {
  const { paymentDetails } = props
  if (!paymentDetails) return []
  return [
    {
      label: 'رقم الفاتورة',
      value: paymentDetails.id,
    },
    {
      label: 'تاريخ الفاتورة',
      value: formatDate(paymentDetails.created_at),
    },
    {
      label: 'فاتورة الطلب',
      value: paymentDetails.pdf,
      key: 'pdf',
    },
    {
      label: 'مهلة الدفع',
      value:
        new Date(paymentDetails.payment_deadline) < new Date()
          ? 'منتهية'
          : 'حتي ' + formatDate(paymentDetails.payment_deadline),
    },
    {
      label: 'نوع الدفع ',
      value: paymentDetails.payment_method,
    },
    {
      label: 'حالة الدفع',
      value: paymentDetails.payment_status,
    },
    {
      label: 'حالة التحويل',
      value: paymentDetails.confirm_transfer,
    },
    {
      label: 'قيمة الطلب',
      value: 'TODO',
    },
    {
      label: 'عمولة المنصة',
      value: paymentDetails.total_commission,
    },
    {
      label: 'المفرج عنه',
      value: paymentDetails.release_total,
    },
    {
      label: 'المعلق',
      value: 'TODO',
    },
    {
      label: 'المكافات',
      value: paymentDetails.prizes,
    },
    {
      label: 'مجموع التكاليف',
      value: paymentDetails.total_costs,
    },
    {
      label: 'القيمة الاساسية',
      value: paymentDetails.main_cost,
    },
    {
      label: 'التكاليف الأخري',
      value: paymentDetails.other_costs,
    },
    {
      label: 'مجموع الخصومات',
      value: paymentDetails.total_discounts,
    },
    {
      label: 'خصم خاص',
      value: paymentDetails.special_discounts,
    },
    {
      label: 'خصم كوبون المنصة',
      value: paymentDetails.coupon_discount,
    },
    {
      label: 'الضريبة',
      value: paymentDetails.tax,
    },
    {
      label: 'إجمالي قيمة الطلب',
      value: 'TODO',
    },
    {
      label: 'نقاط المعلن',
      value: paymentDetails.advertiser_points,
    },
    {
      label: 'نقاط التاجر',
      value: paymentDetails.user_points,
    },
    {
      label: 'نقاط المسوق',
      value: paymentDetails.marketer_points,
    },
    {
      label: 'قيمة نقاط المعلن',
      value: paymentDetails.advertiser_points_value,
    },
    {
      label: 'قيمة نقاط التاجر',
      value: paymentDetails.user_points_value,
    },
    {
      label: 'قيمة نقاط المسوق',
      value: paymentDetails.marketer_points_value,
    },
  ]
})

const commissionInfo = computed(() => {
  const { platformCommissionDetails, paymentDetails } = props
  if (!platformCommissionDetails) return []
  return [
    {
      label: 'معدل العمولة',
      value: platformCommissionDetails.commission_percent + '%',
    },
    {
      label: 'قيمة العمولة',
      value: platformCommissionDetails.commission_value,
    },
    {
      label: 'رقم المرجع',
      value: paymentDetails?.id,
    },
    {
      label: 'حالة الدفع',
      value: platformCommissionDetails.confirm_transfer,
    },
  ]
})
// #endregion
</script>

<template>
  <div>
    <!-- advertiser payment info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات دفع الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list" v-if="paymentInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in paymentInfo"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'pdf' && item.value">
                  <VBtn
                    :href="item.value"
                    :disabled="!item.value"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                  >
                    <VIcon start icon="tabler-file-text" />
                    فاتورة الطلب
                  </VBtn>
                </div>
                <p class="text-body-2 mb-0" v-else>
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
          <div v-else class="text-h6">
            {{ t('general.no_data') }}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <!-- end advertiser payment info -->

    <!-- bank platform commission info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات عمولة المنصة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list" v-if="commissionInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in commissionInfo"
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
          <div v-else class="text-h6">
            {{ t('general.no_data') }}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <!-- end bank platform commission info -->
  </div>
</template>
