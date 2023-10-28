<script setup lang="ts">
import PieChart from '@/modules/statistics/components/PieChart.vue'
import { hexToRgb } from '@layouts/utils'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const vuetifyTheme = useTheme()
const isLoading = ref<boolean>(false)
const data = ref(null)
const filters = reactive({
  date: new Date(),
})

isLoading.value = true
setTimeout(() => {
  data.value = {
    subscriptions: {
      labels: ['جديد (جاري المعالجة)', 'جاري', 'موقوف مؤقتا', 'منتهي', 'مرفوض'],
      series: [80, 50, 35, 25, 10],
    },
    tickets: {
      new: 142,
      active: 28,
      closed: 5,
      average_time_in_hours: 1,
      total: 150,
      finished_percentage: 85,
    },
  }

  isLoading.value = false
}, 1000)

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
      subtitle: tickets.active,
    },
    {
      avatarColor: 'success',
      avatarIcon: 'tabler-lock-check',
      title: 'التذاكر المنتهية',
      subtitle: tickets.closed,
    },
    {
      avatarColor: 'info',
      avatarIcon: 'tabler-clock',
      title: 'متوسط معدل الإجابة',
      subtitle: `${tickets.average_time_in_hours} ساعة`,
    },
  ]
})
// #endregion

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
          background: 'transparent',
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

const paymentsChartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    series: [
      {
        name: 'المدفوعات',
        data: [900, 800, 700, 600, 400, 200, 150],
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
    colors: [
      `rgba(${hexToRgb(currentTheme.primary)}, 1)`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`,
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
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

const earningsReports = [
  {
    color: 'primary',
    icon: 'tabler-file-check',
    title: 'مدفوعات الطلبات',
    amount: '545.69',
    progress: '55',
  },
  {
    color: 'info',
    icon: 'tabler-cash',
    title: 'الدفع الداخلي',
    amount: '256.34',
    progress: '25',
  },
  {
    color: 'error',
    icon: 'tabler-credit-card',
    title: 'الدفع الخارجي',
    amount: '74.19',
    progress: '65',
  },
  {
    color: 'warning',
    icon: 'tabler-businessplan',
    title: 'عمولة المصنة',
    amount: '74.19',
    progress: '65',
  },
  {
    color: 'dark',
    icon: 'tabler-package',
    title: 'مدفوعات الإشتراكات',
    amount: '74.19',
    progress: '65',
  },
  {
    color: 'success',
    icon: 'tabler-report-money',
    title: 'إجمالي الدخل',
    amount: '74.19',
    progress: '65',
  },
]
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
    <VExpansionPanel elevation="0" v-loading="isLoading">
      <VExpansionPanelTitle>احصائيات يومية</VExpansionPanelTitle>
      <VExpansionPanelText>
        <div v-if="data">
          <VCard class="mb-3" flat border>
            <VCardText class="pa-3">
              <div
                class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4"
              >
                <h4>حدد القيم المناسبة لاظهار النتائج</h4>
                <div class="flex-grow-1" style="max-inline-size: 400px">
                  <AppDateTimePicker
                    v-model="filters.data"
                    placeholder="التاريخ"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{ disableMobile: true, maxDate: new Date() }"
                  />
                </div>
              </div>
            </VCardText>
          </VCard>

          <VRow class="my-0">
            <VCol cols="12" lg="6" class="py-0 mb-4">
              <PieChart
                :height="$vuetify.display.smAndDown ? 350 : 300"
                title="الإشتراكات"
                :labels="data.subscriptions.labels"
                :series="data.subscriptions.series"
                class="h-100"
                flat
                border
              />
            </VCol>
            <VCol cols="12" lg="6" class="py-0 mb-4">
              <VCard title="تذاكر الدعم" class="h-100" border flat>
                <VCardText>
                  <VRow class="align-center">
                    <VCol cols="12" md="5" sm="6" class="mt-auto">
                      <div class="mb-1">
                        <h4 class="text-h2">{{ data.tickets.total }}</h4>
                        <p>اجمالي التذاكر</p>
                      </div>

                      <VList class="card-list">
                        <VListItem class="mt-lg-1" v-for="item in ticketsStats" :key="item.title">
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

          <VCard class="mb-2" title="المدفوعات">
            <VCardText>
              <VRow>
                <VCol cols="12" sm="4" md="3" class="d-flex flex-column align-self-end">
                  <div class="d-flex align-center gap-2 mb-2 pb-1 flex-wrap">
                    <h4 class="text-h1">468</h4>
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
                  <VCol
                    v-for="report in earningsReports"
                    :key="report.title"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <div class="d-flex align-center">
                      <VAvatar rounded size="33" :color="report.color" variant="tonal" class="me-2">
                        <VIcon size="25" :icon="report.icon" />
                      </VAvatar>

                      <h6 class="text-base font-weight-medium">
                        {{ report.title }}
                      </h6>
                    </div>
                    <h6 class="text-h5 my-2">
                      {{ report.amount }}
                    </h6>
                    <VProgressLinear
                      :model-value="report.progress"
                      :color="report.color"
                      height="6"
                      rounded
                      rounded-bar
                    />
                  </VCol>
                </VRow>
              </div>
            </VCardText>
          </VCard>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
