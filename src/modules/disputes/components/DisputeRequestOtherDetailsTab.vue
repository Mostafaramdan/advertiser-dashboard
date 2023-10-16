<script setup lang="ts">
import AdsRequestPaymentDetails from '@/components/ads-requests/AdsRequestPaymentDetails.vue'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants'
import type { DisputeRequestOtherInfo, UserStats } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDate } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref<DisputeRequestOtherInfo | any>({})
const disputeRequestId = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const requestInfo = computed(() => {
  const { ads_request } = data.value
  if (!ads_request) return []
  return [
    {
      label: 'تاريخ الطلب',
      value: formatDate(ads_request.created_at),
    },
    {
      label: 'نوع الإعلان',
      value: ads_request.ads_type,
    },
    {
      label: 'قسم الاعلان',
      value: ads_request.category,
    },
    {
      label: 'الدولة',
      value: ads_request.area,
    },
  ]
})

const usersStats = computed(() => {
  return [
    {
      title: 'بيانات الشاكي',
      data: getUserData(data.value.disputer),
    },
    {
      title: 'بيانات المشكي',
      data: getUserData(data.value.disputed),
    },
  ]
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.value = true
  requestsService
    .getOtherDetails(disputeRequestId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function getUserData(userData: UserStats) {
  if (!userData) return []
  return [
    {
      label: 'نوع المستخدم',
      value: USERS_ROLES[userData.type],
    },
    {
      label: 'التقييم',
      value: userData.rate,
    },
    {
      label: 'تاريخ التسجيل',
      value: formatDate(userData.registered_at),
    },
    {
      label: 'مجموع المشتريات',
      value: userData.sells_total,
    },
    {
      label: 'مجموع المدفوعات',
      value: userData.payment_total,
    },
    {
      label: 'الطلبات المكتملة',
      value: userData.finished_requests,
    },
    {
      label: 'الطلبات غير المكتملة',
      value: userData.not_finished_requests,
    },
    {
      label: 'طلبات ملغية من المعلن',
      value: userData.cancelled_requests,
    },
    {
      label: 'مرات التنازع',
      value: userData.dispute_requests_count,
    },
    {
      label: 'الحالات مشتكي فيها',
      value: userData.dispute_requests_from_him,
    },
    {
      label: 'حالات مشتكى عليه',
      value: userData.dispute_requests_to_him,
    },
    {
      label: 'حالات تنازع قيد المداولة',
      value: userData.dispute_requests_inprogress,
    },
    {
      label: 'حالات تنازع معلقة',
      value: userData.dispute_requests_cancelled,
    },
    {
      label: 'حالة انتهاء بصلح داخل المنصة',
      value: userData.dispute_requests_in_app,
    },
    {
      label: 'حالة انتهاء خارج المنصة',
      value: userData.dispute_requests_out_app,
    },
  ]
}

// #endregion
</script>

<template>
  <section class="dispute-other-info" v-loading="isLoading">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow>
              <VCol
                v-for="(item, index) in requestInfo"
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
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VRow>
      <VCol cols="12" lg="6" v-for="(stat, index) in usersStats" :key="index">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>{{ stat.title }}</VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="information-list">
                <VRow>
                  <VCol
                    v-for="(item, index) in stat.data"
                    :key="index"
                    class="py-2 information-list__item"
                    cols="12"
                    sm="6"
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
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>

    <AdsRequestPaymentDetails
      v-if="data.payment_info"
      :payment-details="data.payment_info"
      :platform-commission-details="data.platform_commission"
    />
  </section>
</template>

<style lang="scss" scoped>
.dispute-other-info {
  :deep(.information-list__item h5) {
    min-inline-size: 170px;
  }
}
</style>
