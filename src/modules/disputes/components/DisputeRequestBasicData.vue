<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { useDisputesStore } from '@/stores/DisputesStore'
import type { User } from '../interfaces/DisputeRequest'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { formatDateTime } = UseGeneralHelpers()
const disputesStore = useDisputesStore()

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => {
  const { requestDetails } = disputesStore
  if (!requestDetails) return []
  return [
    {
      label: 'رقم طلب التنازع',
      value: requestDetails.id,
    },
    {
      label: 'نوع طلب التنازع',
      value: requestDetails.request_type,
    },
    {
      label: 'حالة التنازع',
      value: requestDetails.dispute_status,
    },
    {
      label: 'مقدم الطلب',
      value: requestDetails.disputer,
      key: 'disputer',
    },
    {
      label: 'نوع مقدم الطلب',
      value: USERS_ROLES[requestDetails.disputer.role],
    },
    {
      label: 'طرف العلاقة',
      value: requestDetails.disputed,
      key: 'disputed',
    },
    {
      label: 'نوع طرف العلاقة',
      value: USERS_ROLES[requestDetails.disputed.role],
    },
    {
      label: 'رقم طلب الإعلان',
      value: requestDetails.ads_request_id,
    },
    {
      label: 'حالة الطلب',
      value: requestDetails.request_status,
    },
    {
      label: 'تاريخ التنازع',
      value: formatDateTime(requestDetails.created_at),
    },
    {
      label: 'تاريخ أخر تعديل',
      value: formatDateTime(requestDetails.updated_at),
    },
    {
      label: 'حالة الدفع',
      value: requestDetails.payment_status,
    },
    {
      label: 'مبلغ الطلب',
      value: requestDetails.ads_request_total,
    },
    {
      label: 'مبلغ الاسترداد',
      value: requestDetails.retake_money,
    },
    {
      label: 'المبلغ المقبول',
      value: requestDetails.accepted_money,
    },
  ]
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getProfileUrl(user: User) {
  return {
    name: user.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
    params: { id: user.id },
    query: { tab: 'details' },
  }
}
// #endregion
</script>

<template>
  <VExpansionPanels
    class="expansion-panels-width-border mb-6"
    :model-value="0"
    v-loading="!data.length"
  >
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle>عرض بيانات التنازع</VExpansionPanelTitle>
      <VExpansionPanelText>
        <div class="order-info">
          <VRow class="mt-0">
            <VCol
              v-for="(item, index) in data"
              :key="index"
              class="py-1 py-sm-2 order-info__item"
              cols="12"
              sm="6"
              lg="4"
            >
              <h5 class="text-primary text-subtitle-2">
                {{ item.label }}
              </h5>
              <router-link
                v-if="['disputer', 'disputed'].includes(item.key as string)"
                :to="getProfileUrl(item.value)"
              >
                {{ item.value.username }}
              </router-link>
              <p class="text-body-2 mb-0" v-else>
                {{ item.value ?? '-' }}
              </p>
            </VCol>
          </VRow>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
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
