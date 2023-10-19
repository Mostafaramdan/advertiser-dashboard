import type { ChartsData, StatsTableListItem } from './Statistics'

export interface PackagesData {
  charts: ChartsData
  counters: {
    [key: string]: StatsTableListItem[]
  }
}
