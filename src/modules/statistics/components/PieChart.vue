<script setup lang="ts">
import { PIE_CHART_OPTIONS } from '@/constants/apexcharts'
import VueApexCharts from 'vue3-apexcharts'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    title: string
    series: number[]
    labels: string[]
  }>(),
  {},
)
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const chartData = computed(() => {
  return {
    series: props.series,
    options: {
      ...PIE_CHART_OPTIONS,
      labels: props.labels,
    },
  }
})
// #endregion
</script>

<template>
  <VCard :title="title" class="pie-chart">
    <VCardText>
      <VueApexCharts
        :options="chartData.options"
        :series="chartData.series"
        type="pie"
        height="350px"
        v-if="chartData.series.some((s) => s)"
      />
      <div v-else class="text-h6">
        {{ t('general.no_data') }}
      </div>
    </VCardText>
  </VCard>
</template>
