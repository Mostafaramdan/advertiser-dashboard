<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const adsRequestsStore = useAdsRequestsStore()
const { formatDateTime } = UseGeneralHelpers()

const headers: any = [
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'اسم الحركة',
    key: 'title',
  },
  {
    title: 'التاريخ',
    key: 'created_at',
  },
  {
    title: 'الوصف',
    key: 'description',
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const historyData = computed(() => {
  return adsRequestsStore.adsRequestDetails.ads_request_logs
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

// #endregion
</script>

<template>
  <div class="order-history-tab">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض سجل الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VDataTableServer
            :headers="headers"
            :items="historyData"
            :items-length="historyData.length"
            class="app-table"
            :no-data-text="t('general.no_data')"
          >
            <template #item.created_at="{ item }">
              <div class="text-no-wrap">
                {{ formatDateTime(item.raw.created_at) }}
                <span class="text-sm text-disabled d-block">{{ item.raw.time_ago }}</span>
              </div>
            </template>
            <template #item.title="{ item }">
              <div style="min-width: 200px">
                {{ item.raw.title }}
              </div>
            </template>
            <template #item.description="{ item }">
              <div style="min-width: 250px">
                {{ item.raw.description || '-' }}
              </div>
            </template>
            <template #bottom> </template>
          </VDataTableServer>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
