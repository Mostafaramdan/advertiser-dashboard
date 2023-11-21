<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { REQUEST_TYPES } from '@/constants/ads-requests'
import { formatUrl } from '@/helpers/index'
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
import AdsRequestPaymentDetails from './AdsRequestPaymentDetails.vue'

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
  const { order_info, advertiser, user, id, created_at, order_content } =
    adsRequestsStore.adsRequestDetails
  return [
    {
      label: 'اسم المعلن',
      value: advertiser.account_name,
    },
    {
      label: 'اسم العميل',
      value: user.account_name,
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
      label: 'قسم الاعلان',
      value: order_info.ads_category,
    },
    {
      label: 'طريقة الاعلان',
      value: order_info.ads_method,
    },
    {
      label: 'فترة الاعلان',
      value: order_info.range_date,
    },
    {
      label: 'عدد مرات التكرار',
      value: order_info.repeat_count,
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
      label: 'نوع الطلب',
      value: REQUEST_TYPES[order_content.campaign_type],
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

const paymentDetails = computed(() => adsRequestsStore.adsRequestDetails?.payment_info)
const platformCommissionDetails = computed(
  () => adsRequestsStore.adsRequestDetails?.platform_commission,
)

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
// #endregion
</script>

<template>
  <div class="order-details-tab">
    <!-- orderInfo info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow>
              <VCol
                v-for="(item, index) in orderInfo"
                :key="index"
                class="py-2 information-list__item"
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

    <AdsRequestPaymentDetails
      :paymentDetails="paymentDetails"
      :platformCommissionDetails="platformCommissionDetails"
    />

    <!-- bank transfer info info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات التحويل خارج المنصة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list" v-if="bankTransferInfo.length">
            <VRow>
              <VCol
                v-for="(item, index) in bankTransferInfo"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'transfer_image'">
                  <a
                    :href="formatUrl(item.value)"
                    target="_blank"
                    v-if="item.value"
                    class="mt-2 d-block"
                  >
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
  </div>
</template>
