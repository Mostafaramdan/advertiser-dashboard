<script setup lang="ts">
import BarChart from '../components/BarChart.vue'
import DonutChart from '../components/DonutChart.vue'
import MonoPieChart from '../components/MonoPieChart.vue'
import PieChart from '../components/PieChart.vue'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    charts: any
  }>(),
  {},
)
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getChartComponent(type: string) {
  switch (type) {
    case 'pie':
      return PieChart
    case 'dount':
      return DonutChart
    case 'bar':
      return BarChart
    case 'monopie':
      return MonoPieChart
    default:
      return 'div'
  }
}
// #endregion
</script>

<template>
  <!-- charts -->
  <div class="charts-row mb-2">
    <div
      class="charts-row__item"
      :class="{ 'w-100': chart.type === 'bar' }"
      v-for="(chart, index) in charts"
      :key="index"
    >
      <component
        :is="getChartComponent(chart.type)"
        :title="chart.title"
        :labels="chart.data.labels"
        :series="chart.data.series"
      />
    </div>
  </div>
  <!-- end charts -->
</template>

<style lang="scss" scoped>
.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  &__item {
    flex-grow: 1;
    inline-size: calc(50% - 1rem);

    @media (max-width: 1199.98px) {
      inline-size: 100%;
    }
  }
}
</style>
