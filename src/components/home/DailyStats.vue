<script setup lang="ts">
import { DAYS } from '@/constants/index'
import DonutChart from '@/modules/statistics/components/DonutChart.vue'
import type { DailyStatsData } from '@/modules/statistics/interfaces/General'
import { statisticsService } from '@/modules/statistics/services/StatisticsService'
import { hexToRgb } from '@layouts/utils'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import PaymentStatsCard from './PaymentStatsCard.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const vuetifyTheme = useTheme()
const isLoading = ref<boolean>(false)
const data = ref<DailyStatsData | null>(null)
const params = reactive({
  date: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const ticketsStats = computed(() => {
  if (!data.value) return []
  const { tickets } = data.value
  return [
    {
      avatarColor: 'primary',
      avatarIcon: 'tabler-ticket',
      title: 'التذاكر الجديدة',
      subtitle: tickets.new,
    },
    {
      avatarColor: 'warning',
      avatarIcon: 'tabler-file-check',
      title: 'التذاكر الجارية',
      subtitle: tickets.opened,
    },
    {
      avatarColor: 'success',
      avatarIcon: 'tabler-lock-check',
      title: 'التذاكر المنتهية',
      subtitle: tickets.finished,
    },
    {
      avatarColor: 'info',
      avatarIcon: 'tabler-clock',
      title: 'متوسط معدل الإجابة',
      subtitle: `${tickets.average_time_in_hours} ساعة`,
    },
  ]
})

const ticketsChartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    labels: ['نسبة التذاكر المنتهية'],
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -138,
        endAngle: 140,
        hollow: {
          size: '65%',
        },
        track: {
          background: `rgba(${hexToRgb(currentTheme['background'])}`,
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            offsetY: -20,
            color: `rgba(${hexToRgb(currentTheme['on-background'])},${
              variableTheme['high-emphasis-opacity']
            })`,
            fontSize: '18px',
            fontWeight: '400',
            fontFamily: 'Public Sans',
          },
          value: {
            offsetY: 10,
            color: `rgba(${hexToRgb(currentTheme['on-background'])},${
              variableTheme['high-emphasis-opacity']
            })`,
            fontSize: '35px',
            fontWeight: '400',
            fontFamily: 'Public Sans',
          },
        },
      },
    },
    colors: [currentTheme.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        gradientToColors: [currentTheme.primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [30, 70, 100],
      },
    },
    stroke: {
      dashArray: 10,
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    grid: {
      padding: {
        top: -30,
        bottom: 0,
        right: 5,
        left: 5,
      },
    },
  }
})

const paymentsStats = computed(() => {
  if (!data.value) return []
  const { payments } = data.value
  return [
    {
      color: 'success',
      icon: 'tabler-report-money',
      title: 'إجمالي الدخل',
      amount: payments.total_income,
      progress: 100,
    },
    {
      color: 'warning',
      icon: 'tabler-businessplan',
      title: 'عمولة المصنة',
      amount: payments.commission,
      progress: Math.round((payments.commission / payments.total_income) * 100),
    },
    {
      color: 'dark',
      icon: 'tabler-package',
      title: 'مدفوعات الإشتراكات',
      amount: payments.subscriptions,
      progress: Math.round((payments.subscriptions / payments.total_income) * 100),
    },
  ]
})

const requestsStats = computed(() => {
  if (!data.value) return []
  const { payments } = data.value
  return [
    {
      color: 'primary',
      icon: 'tabler-file-check',
      title: 'مدفوعات الطلبات',
      amount: payments.requests,
      progress: Math.round((payments.requests / payments.requests) * 100),
    },
    {
      color: 'info',
      icon: 'tabler-cash',
      title: 'الدفع الداخلي',
      amount: payments.internal_payment,
      progress: Math.round((payments.internal_payment / payments.requests) * 100),
    },
    {
      color: 'error',
      icon: 'tabler-credit-card',
      title: 'الدفع الخارجي',
      amount: payments.external_payment,
      progress: Math.round((payments.external_payment / payments.requests) * 100),
    },
  ]
})

const paymentsChartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  if (!data.value) return {}
  const { payments } = data.value
  const currentDay = new Date().getDay()
  const colors = [
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
    `rgba(${hexToRgb(currentTheme.primary)}, .5`,
  ]
  colors[currentDay] = `rgba(${hexToRgb(currentTheme.primary)}, 1)`

  return {
    series: [
      {
        name: 'المدفوعات',
        data: payments.chart.data,
      },
    ],
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '38%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        right: -10,
      },
    },
    colors,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: Object.values(DAYS),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  }
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
  statisticsService
    .getDailyStats(params)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle>احصائيات يومية</VExpansionPanelTitle>
      <VExpansionPanelText>
        <VCard class="mb-3" flat border>
          <VCardText class="pa-3">
            <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
              <h4>حدد القيم المناسبة لاظهار النتائج</h4>
              <div class="flex-grow-1" style="max-inline-size: 400px">
                <AppDateTimePicker
                  v-model="params.date"
                  placeholder="التاريخ"
                  clearable
                  prepend-inner-icon="tabler-calendar"
                  :config="{ disableMobile: true, maxDate: new Date(), onChange: () => getData() }"
                />
              </div>
            </div>
          </VCardText>
        </VCard>
        <div v-loading="isLoading" style="min-block-size: 250px">
          <template v-if="data">
            <VRow class="my-0">
              <VCol cols="12" lg="6" class="py-0 mb-4">
                <DonutChart
                  :height="$vuetify.display.smAndDown ? 350 : 200"
                  title="الإشتراكات"
                  :labels="data.subscriptions.labels"
                  :series="data.subscriptions.series"
                  class="h-100"
                  flat
                  border
                />
              </VCol>
              <VCol cols="12" lg="6" class="py-0 mb-4">
                <VCard :title="`تذاكر الدعم ${data.tickets.all}`" class="h-100" border flat>
                  <VCardText>
                    <VRow class="align-center">
                      <VCol cols="12" md="5" sm="6" class="mt-auto">
                        <VList class="card-list">
                          <VListItem v-for="item in ticketsStats" :key="item.title">
                            <VListItemTitle class="font-weight-medium">
                              {{ item.title }}
                            </VListItemTitle>
                            <VListItemSubtitle class="text-disabled">
                              {{ item.subtitle }}
                            </VListItemSubtitle>
                            <template #prepend>
                              <VAvatar rounded size="34" :color="item.avatarColor" variant="tonal">
                                <VIcon :icon="item.avatarIcon" />
                              </VAvatar>
                            </template>
                          </VListItem>
                        </VList>
                      </VCol>
                      <VCol cols="12" md="7" sm="6">
                        <VueApexCharts
                          :options="ticketsChartOptions"
                          :series="[data.tickets.finished_percentage]"
                          height="290"
                        />
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <VCard class="mb-2" flat border title="المدفوعات">
              <VCardText>
                <VRow>
                  <VCol cols="12" sm="4" md="3" class="d-flex flex-column align-self-end">
                    <div class="d-flex align-center gap-2 mb-2 pb-1 flex-wrap">
                      <h4 class="text-h1">{{ data.payments.total_income }}</h4>
                    </div>

                    <span class="text-sm text-body"
                      >إجمالي الدخل (عمولة المنصة + مدفوعات الإشتراكات)</span
                    >
                  </VCol>

                  <VCol cols="12" sm="8" md="9" class="pt-0">
                    <VueApexCharts
                      :options="paymentsChartOptions"
                      :series="paymentsChartOptions.series"
                      height="190"
                    />
                  </VCol>
                </VRow>

                <div class="border rounded mt-3 pa-4">
                  <VRow>
                    <VCol v-for="item in paymentsStats" :key="item.title" cols="12" sm="6" md="4">
                      <PaymentStatsCard :stats="item" />
                    </VCol>
                  </VRow>
                </div>

                <div class="border rounded mt-3 pa-4">
                  <VRow>
                    <VCol v-for="item in requestsStats" :key="item.title" cols="12" sm="6" md="4">
                      <PaymentStatsCard :stats="item" />
                    </VCol>
                  </VRow>
                </div>
              </VCardText>
            </VCard>
          </template>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="scss" scoped>
:dee(.card-list .v-list-item:not(:last-child)) {
  padding-block-end: 5px !important;
}
</style>
