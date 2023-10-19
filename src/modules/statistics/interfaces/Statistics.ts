export interface BarChart {
  type: string
  title: string
  data: {
    series: {
      name: string
      data: number[]
    }[]
    labels: string[]
  }
}

export interface PieChart {
  type: string
  title: string
  data: {
    series: number[]
    labels: string[]
  }
}

export interface DonutChart extends PieChart {}

export interface MonoPieChart extends PieChart {}

export type ChartsData = BarChart[] | PieChart[] | DonutChart[] | MonoPieChart[]

export interface StatsTableListItem {
  title: string
  icon: string
  value: number
  percentage: number
}
