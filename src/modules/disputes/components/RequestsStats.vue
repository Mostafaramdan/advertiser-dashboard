<script setup lang="ts">
import type { RequestsStats } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const data = ref<RequestsStats | any>(null)
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const stats = computed(() => {
  return [
    {
      title: 'الاجمالي',
      key: 'total',
      icon: 'tabler-analyze',
      color: 'primary',
    },
    {
      title: 'جديد',
      key: 'new',
      icon: 'tabler-file-plus',
      color: 'info',
    },
    {
      title: 'مفتوح',
      key: 'opened',
      icon: 'tabler-clock-record',
      color: 'dark',
    },
    {
      title: 'تم القبول',
      key: 'accepted',
      icon: 'tabler-file-check',
      color: 'warning',
    },
    {
      title: 'تم التاكيد',
      key: 'confirmed',
      icon: 'tabler-checks',
      color: 'success',
    },
    {
      title: 'مكتمل',
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
  requestsService
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
            <VCol v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="2" class="pt-0">
              <VSkeletonLoader type="list-item-avatar-two-line" />
            </VCol>
          </VRow>

          <VRow class="mt-0" v-else-if="data">
            <VCol v-for="item in stats" :key="item.title" cols="12" sm="6" md="4" lg="2">
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
