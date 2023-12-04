<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { OFFER_TYPES, PRODUCT_STATUSES } from '@/constants/offers'
import type { OfferStatsData } from '@/interfaces/Offer'
import { offersService } from '@/services/OffersService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDate } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref<OfferStatsData | null>(null)
const offerId: number = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

const statsData = computed(() => {
  if (!data.value) return []
  const {
    created_at,
    days_count,
    offer_type,
    posts_count,
    product_condition,
    seen_count,
    goes_count,
    shares_count,
    reports_count,
    rate_count,
    rate,
    offer_start_reminder_count,
    offer_availability_reminder_count,
    offer_open_chats_count,
    favorites_count,
    user_favorites_count,
  } = data.value
  return [
    {
      label: 'تاريخ بداية العرض',
      value: formatDate(created_at),
    },
    {
      label: 'مدة العرض',
      value: days_count,
    },
    {
      label: 'نوع العرض',
      value: OFFER_TYPES.get(offer_type)?.label,
    },
    {
      label: 'عدد مرات العرض',
      value: posts_count,
    },
    {
      label: 'حالة المنتج',
      value: PRODUCT_STATUSES.get(product_condition)?.label,
    },
    {
      label: 'عدد مرات فتح العرض',
      value: seen_count,
    },
    {
      label: 'عدد مرات الذهاب للمتجر',
      value: goes_count,
    },
    {
      label: 'عددمرات مشاركة العرض',
      value: shares_count,
    },
    {
      label: 'مرات التبليغ عن العرض',
      value: reports_count,
    },
    {
      label: 'عدد مرات التقييم',
      value: rate_count,
    },
    {
      label: 'متوسط التقييم',
      value: rate,
      key: 'rate',
    },
    {
      label: 'مرات بلغني عند التوفر',
      value: offer_start_reminder_count,
    },
    {
      label: 'مرات بلغني عند بدء العرض',
      value: offer_availability_reminder_count,
    },
    {
      label: 'عدد المتحدثين مع التاجر',
      value: offer_open_chats_count,
    },
    {
      label: 'عدد تفضيلات المنتج',
      value: favorites_count,
    },
    {
      label: 'عدد متابعات التاجر',
      value: user_favorites_count,
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
  offersService
    .getStatistics(offerId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <section v-loading="isLoading" style="min-block-size: 200px">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> الاحصائيات </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow>
              <VCol
                v-for="(item, index) in statsData"
                :key="index"
                class="py-2 information-list__item flex-column"
                cols="12"
                sm="6"
                md="3"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'rate'">
                  <span class="d-flex align-center text-sm">
                    <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                    {{ item.value ?? '-' }}
                  </span>
                </div>
                <p v-else class="text-body-2 mb-0">
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>
</template>
