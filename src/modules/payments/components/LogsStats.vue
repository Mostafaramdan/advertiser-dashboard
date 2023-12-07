<script setup lang="ts">
import type { LogsStats } from '../interfaces/Logs'
import { logsService } from '../services/LogsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const data = ref<LogsStats | any>(null)
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const stats = computed(() => {
  return [
    {
      title: 'مجموع المبيعات',
      key: 'sales_total',
      icon: 'tabler-currency-dollar',
      color: 'success',
    },
    {
      title: 'مجموع السحب',
      key: 'withdrawn_total',
      icon: 'tabler-cash-banknote',
      color: 'primary',
    },
    {
      title: 'مجموع الشحن',
      key: 'charge_total',
      icon: 'tabler-truck-delivery',
      color: 'info',
    },
    {
      title: 'مجموع المشتريات',
      key: 'purchases_total',
      icon: 'tabler-shopping-cart',
      color: 'dark',
    },
    {
      title: 'رصيد المحفظة الحالي',
      key: 'current_total_wallet',
      icon: 'tabler-wallet',
      color: 'success',
    },
    {
      title: 'الارصدة المعلقة',
      key: 'pending_balance_total',
      icon: 'tabler-wallet-off',
      color: 'error',
    },
    {
      title: 'الارصدة القابلة للسحب',
      key: 'available_withdrawn',
      icon: 'tabler-cash',
      color: 'warning',
    },
    {
      title: 'دخل المنصة',
      key: 'platform_income',
      icon: 'tabler-report-money',
      color: 'success',
    },
  ]
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  logsService
    .getLogsStats()
    .then((res) => {
      data.value = res.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <div class="subscriptions-logs-stats">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض الاحصائيات</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow class="mt-0" v-if="isLoading">
            <VCol v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3" class="pt-0">
              <VSkeletonLoader type="list-item-avatar-two-line" />
            </VCol>
          </VRow>

          <VRow class="mt-0" v-else-if="data">
            <VCol v-for="item in stats" :key="item.key" cols="12" sm="6" md="4" lg="3">
              <div class="h-100 d-flex gap-2">
                <VAvatar :color="item.color" variant="tonal" size="40">
                  <VIcon :icon="item.icon" />
                </VAvatar>
                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ data[item.key] }}</span>
                  <span class="text-sm">
                    {{ item.title }}
                  </span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
