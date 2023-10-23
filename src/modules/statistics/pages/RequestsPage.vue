<script setup lang="ts">
import StatsChart from '../components/StatsChart.vue'
import StatsFilter from '../components/StatsFilter.vue'
import StatsTable from '../components/StatsTable.vue'
import TopRequestsFromAdvertisers from '../components/TopRequestsFromAdvertisers.vue'
import TopRequestsFromClients from '../components/TopRequestsFromClients.vue'
import type { RequestsData } from '../interfaces/Requests'
import { statisticsService } from '../services/StatisticsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const isLoading = ref<boolean>(false)
const data = ref<RequestsData | null>(null)
const params = reactive({
  year: new Date().getFullYear(),
  period: null,
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
    .getRequestsStats(params)
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
      <h3>تقرير الطلبات</h3>
    </div>
    <div class="flex-grow-1" v-loading="isLoading">
      <StatsFilter :init-filters="params" @apply-filter="onApplyFilter" />
      <template v-if="data">
        <StatsChart :charts="data.charts" />
        <StatsTable :stats="data.statistics.counters" class="mt-5" />
        <TopRequestsFromClients :stats="data.statistics.top_requests_from_clients" class="mt-5" />
        <TopRequestsFromAdvertisers
          :stats="data.statistics.top_requests_from_advertisers"
          class="mt-5"
        />
      </template>
    </div>
  </section>
</template>
