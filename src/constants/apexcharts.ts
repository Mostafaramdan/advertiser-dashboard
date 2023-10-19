export const PIE_CHART_OPTIONS = {
  stroke: { width: 0 },
  chart: {
    type: 'pie',
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.8,
      },
    },
  },
  legend: {
    position: 'right',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '78%',
      },
    },
  },
  responsive: [
    {
      breakpoint: 650,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}

export const DONUT_CHART_OPTIONS = {
  stroke: { width: 0 },
  chart: {
    type: 'donut',
  },
  legend: {
    position: 'right',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '78%',
      },
    },
  },
  responsive: [
    {
      breakpoint: 650,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}

export const BAR_CHART_OPTIONS = {
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.8,
      },
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  yaxis: {
    labels: {
      style: { colors: 'rgba(var(--v-theme-grey-900), 100%)' },
    },
  },
}
