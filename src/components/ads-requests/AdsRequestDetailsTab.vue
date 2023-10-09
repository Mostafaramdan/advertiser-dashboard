<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const adsRequestsStore = useAdsRequestsStore()
const { formatDate } = UseGeneralHelpers()
const route = useRoute()
const adRequestId = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const orderInfo = computed(() => {
  const { order_info, advertiser, user, id, created_at } = adsRequestsStore.adsRequestDetails
  return [
    {
      label: 'اسم المعلن',
      value: advertiser.username,
    },
    {
      label: 'اسم العميل',
      value: user.username,
    },
    {
      label: 'رقم الطلب',
      value: id,
    },
    {
      label: 'تاريخ الطلب',
      value: formatDate(created_at),
    },
    {
      label: 'اعلانات الطلب',
      value: order_info.ads_count,
      key: 'ads_count',
    },
    {
      label: 'طريقة الاعلان',
      value: order_info.ads_method,
    },
    {
      label: 'قسم الاعلان',
      value: order_info.ads_category,
    },
    {
      label: 'عدد مرات التكرار',
      value: order_info.repeat_count,
    },
    {
      label: 'فترة الاعلان',
      value: order_info.range_date,
    },
    {
      label: 'تقييم المعلن',
      value: advertiser.rate,
    },
    {
      label: 'تقييم العميل',
      value: user.rate,
    },
    {
      label: 'تقييم الاعلان',
      value: order_info.rate,
    },
    {
      label: 'نوع الاعلان',
      value: order_info.ads_type,
    },
    {
      label: 'اسم الاعلان المقترح',
      value: order_info.title,
    },
    {
      label: 'وصف الطلب',
      value: order_info.description,
    },
  ]
})

const advertiserPaymentInfo = computed(() => {
  const { payment_info } = adsRequestsStore.adsRequestDetails
  if (!payment_info) return []
  return [
    {
      label: 'رقم الفاتورة',
      value: payment_info.id,
    },
    {
      label: 'تاريخ الفاتورة',
      value: formatDate(payment_info.created_at),
    },
    {
      label: 'فاتورة الطلب',
      value: payment_info.pdf,
      key: 'pdf',
    },
    {
      label: 'مهلة الدفع',
      value:
        new Date(payment_info.payment_deadline) < new Date()
          ? 'منتهية'
          : 'حتي ' + formatDate(payment_info.payment_deadline),
    },
    {
      label: 'نوع الدفع ',
      value: payment_info.payment_method,
    },
    {
      label: 'حالة الدفع',
      value: payment_info.payment_status,
    },
    {
      label: 'حالة التحويل',
      value: payment_info.confirm_transfer,
    },
    {
      label: 'قيمة الطلب',
      value: 'TODO',
    },
    {
      label: 'عمولة المنصة',
      value: payment_info.total_commission,
    },
    {
      label: 'المفرج عنه',
      value: payment_info.release_total,
    },
    {
      label: 'المعلق',
      value: 'TODO',
    },
    {
      label: 'المكافات',
      value: payment_info.prizes,
    },
    {
      label: 'مجموع التكاليف',
      value: payment_info.total_costs,
    },
    {
      label: 'القيمة الاساسية',
      value: payment_info.main_cost,
    },
    {
      label: 'التكاليف الأخري',
      value: payment_info.other_costs,
    },
    {
      label: 'مجموع الخصومات',
      value: payment_info.total_discounts,
    },
    {
      label: 'خصم خاص',
      value: payment_info.special_discounts,
    },
    {
      label: 'خصم كوبون المنصة',
      value: payment_info.coupon_discount,
    },
    {
      label: 'الضريبة',
      value: payment_info.tax,
    },
    {
      label: 'إجمالي قيمة الطلب',
      value: 'TODO',
    },
    {
      label: 'نقاط المعلن',
      value: payment_info.advertiser_points,
    },
    {
      label: 'نقاط التاجر',
      value: payment_info.user_points,
    },
    {
      label: 'نقاط المسوق',
      value: payment_info.marketer_points,
    },
    {
      label: 'قيمة نقاط المعلن',
      value: payment_info.advertiser_points_value,
    },
    {
      label: 'قيمة نقاط التاجر',
      value: payment_info.user_points_value,
    },
    {
      label: 'قيمة نقاط المسوق',
      value: payment_info.marketer_points_value,
    },
  ]
})

const bankTransferInfo = computed(() => {
  const { transfer_info_out_platforms } = adsRequestsStore.adsRequestDetails
  if (!transfer_info_out_platforms) return []
  return [
    {
      label: 'البنك المحول منه',
      value: transfer_info_out_platforms.bank_name,
    },
    {
      label: 'قيمة التحويل',
      value: transfer_info_out_platforms.total_transfer,
    },
    {
      label: 'تاريخ التحويل',
      value: formatDate(transfer_info_out_platforms.transferred_at),
    },
    {
      label: 'صورة التحويل',
      value: transfer_info_out_platforms.transfer_image,
      key: 'transfer_image',
    },
  ]
})

const commissionInfo = computed(() => {
  const { platform_commission } = adsRequestsStore.adsRequestDetails
  if (!platform_commission) return []
  return [
    {
      label: 'معدل العمولة',
      value: platform_commission.commission_percent + '%',
    },
    {
      label: 'قيمة العمولة',
      value: platform_commission.commission_value,
    },
    {
      label: 'رقم المرجع',
      value: adsRequestsStore.adsRequestDetails.payment_info?.id,
    },
    {
      label: 'حالة الدفع',
      value: platform_commission.confirm_transfer,
    },
  ]
})
// #endregion
</script>

<template>
  <div class="order-details-tab">
    <!-- orderInfo info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="order-info">
            <VRow>
              <VCol
                v-for="(item, index) in orderInfo"
                :key="index"
                class="py-2 order-info__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <router-link
                  v-if="item.key === 'ads_count' && item.value"
                  :to="{
                    name: 'ads-page',
                    query: { ad_request_id: adRequestId },
                  }"
                  >{{ item.value }}</router-link
                >
                <p class="text-body-2 mb-0" v-else>
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <!-- end order info -->

    <!-- advertiser payment info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات الدفع للمعلن</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="order-info" v-if="advertiserPaymentInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in advertiserPaymentInfo"
                :key="index"
                class="py-2 order-info__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'pdf'">
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

    <!-- bank transfer info info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات التحويل خارج المنصة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="order-info" v-if="bankTransferInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in bankTransferInfo"
                :key="index"
                class="py-2 order-info__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'transfer_image'">
                  <a :href="item.value" target="_blank" v-if="item.value" class="mt-2 d-block">
                    <VAvatar variant="outlined" size="80" cover rounded="0">
                      <VImg :src="item.value" />
                    </VAvatar>
                  </a>
                  <span v-else>-</span>
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
    <!-- end bank transfer info -->

    <!-- bank transfer info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات عمولة المنصة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="order-info" v-if="commissionInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in commissionInfo"
                :key="index"
                class="py-2 order-info__item"
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
    <!-- end bank transfer info -->
  </div>
</template>

<style lang="scss" scoped>
.order-info {
  &__item {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;

    @include responsive-down('md') {
      flex-direction: column;
    }

    h5 {
      min-inline-size: 120px;
    }

    p {
      word-break: break-word;
    }
  }
}
</style>
