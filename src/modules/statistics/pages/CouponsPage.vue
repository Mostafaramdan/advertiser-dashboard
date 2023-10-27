<script setup lang="ts">
import AdvertisersCouponsStats from '../components/AdvertisersCouponsStats.vue'
import ClientsCouponsStats from '../components/ClientsCouponsStats.vue'
import MostUsedCouponsStats from '../components/MostUsedCouponsStats.vue'
import StatsChart from '../components/StatsChart.vue'
import StatsFilter from '../components/StatsFilter.vue'
import StatsTable from '../components/StatsTable.vue'
import type { CouponsData } from '../interfaces/Coupons'
import { statisticsService } from '../services/StatisticsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const isLoading = ref<boolean>(false)
const data = ref<CouponsData | null>(null)
const params = reactive({
  year: new Date().getFullYear(),
  period: 6,
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
  statisticsService
    .getCouponsStats(params)
    .then((res) => {
      data.value = res.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters })
  getPageData()
}
// #endregion
</script>

<template>
  <section class="page-card d-flex flex-column">
    <div class="d-flex mb-3 align-center">
      <PageBackBtn :link="{ name: 'statistics-index' }" />
      <h3>تقرير الكوبونات</h3>
    </div>
    <div class="flex-grow-1" v-loading="isLoading">
      <StatsFilter :init-filters="params" @apply-filter="onApplyFilter" />
      <template v-if="data">
        <StatsChart :charts="data.charts" />
        <StatsTable :stats="data.statistics.counters" class="mt-5" />
        <MostUsedCouponsStats :stats="data.statistics.most_used" class="mt-5" />
        <AdvertisersCouponsStats :stats="data.statistics.advertisers" class="mt-5" />
        <ClientsCouponsStats :stats="data.statistics.clients" class="mt-5" />
      </template>
    </div>
  </section>
</template>
