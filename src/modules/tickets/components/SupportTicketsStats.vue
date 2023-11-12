<script setup lang="ts">
import { TICKETS_STATUSES } from '@/constants/tickets'

import type { SupportTicketsStats } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const data = ref<SupportTicketsStats | any>(null)
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const stats = computed(() => {
  return [
    // {
    //   key: 'total',
    //   icon: 'tabler-ticket',
    //   color: 'primary',
    // },
    {
      key: 'new',
      icon: 'tabler-file-plus',
      color: 'primary',
    },
    {
      key: 'opened',
      icon: 'tabler-file-check',
      color: 'info',
    },
    {
      key: 'answered',
      icon: 'tabler-checks',
      color: 'success',
    },
    {
      key: 'delayed',
      icon: 'tabler-clock-cancel',
      color: 'error',
    },
    {
      key: 'transferred',
      icon: 'tabler-refresh',
      color: 'info',
    },
    {
      key: 'waiting',
      icon: 'tabler-clock-record',
      color: 'warning',
    },
    {
      key: 'cancelled',
      icon: 'tabler-lock',
      color: 'dark',
    },
    {
      key: 'finished',
      icon: 'tabler-lock-check',
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
  supportTicketsService
    .getRequestsStats({})
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
                    {{ item.key === 'total' ? 'الاجمالي' : TICKETS_STATUSES.get(item.key)?.label }}
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
