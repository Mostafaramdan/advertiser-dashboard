<script setup lang="ts">
import { BAR_CHART_OPTIONS } from '@/constants/apexcharts'
import VueApexCharts from 'vue3-apexcharts'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    title: string
    series: { name: string; data: number[] }[]
    labels: string[]
  }>(),
  {},
)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const chartData = computed(() => {
  return {
    series: props.series,
    options: {
      ...BAR_CHART_OPTIONS,
      xaxis: {
        categories: props.labels,
      },
    },
  }
})
// #endregion
</script>

<template>
  <VCard :title="title" class="bar-chart">
    <VCardText>
      <VueApexCharts
        :options="chartData.options"
        :series="chartData.series"
        type="bar"
        height="400px"
      />
    </VCardText>
  </VCard>
</template>
