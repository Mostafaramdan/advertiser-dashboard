<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { AdsSpaceStats } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref<AdsSpaceStats | null>(null)
const adsSpaceId = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const adsSpaceInfo = computed<any>(() => {
  if (!data.value) return []
  const {
    space_created_at,
    total_days,
    participants_count,
    shares_confirmed,
    watches_count,
    snapchat_watches,
    beTrend_watches,
    instagram_watches,
    total_balance,
    transfer_balance,
    pending_balance,
    withdrawable_balance,
  } = data.value
  return [
    {
      label: 'بداية تاريخ المساحة',
      value: formatDateTime(space_created_at),
    },
    {
      label: 'إجمالي مدة المساحة',
      value: total_days,
    },
    {
      label: 'عدد المشتركين',
      value: participants_count,
    },
    {
      label: 'مجموع المشاركات',
      value: shares_confirmed,
    },
    {
      label: 'مجموع المشاهدات',
      value: watches_count,
    },
    {
      label: 'مشاهدات سناب شات',
      value: snapchat_watches,
    },
    {
      label: 'مشاهدات بي ترند',
      value: beTrend_watches,
    },
    {
      label: 'مشاهدات انستجرام',
      value: instagram_watches,
    },
    {
      label: 'مجموع رصيد العمليات',
      value: total_balance,
    },
    {
      label: 'الرصيد المحول',
      value: transfer_balance,
    },
    {
      label: 'الرصيد المعلق',
      value: pending_balance,
    },
    {
      label: 'الرصيد القابل للسحب',
      value: withdrawable_balance,
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
  adsSpacesService
    .getStats(adsSpaceId)
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
  <section class="details-tab" v-loading="isLoading">
    <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>إحصائيات المساحة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow class="my-0">
              <VCol
                v-for="(item, index) in adsSpaceInfo"
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
  </section>
</template>
