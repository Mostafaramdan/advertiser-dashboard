import type { ChartsData, StatsTableListItem } from './Statistics'

export interface DocumentItem {
  id: number
  name: string
  type: string
  user?: {
    id: number
    role: string
    username: string
    phone: string
    email: string
    image_path: string
  }
  created_at: string
  ended_at: string
  last_update: string
}

export interface DocumentsData {
  charts: ChartsData
  statistics: {
    counters: StatsTableListItem[]
    expired: DocumentItem[]
  }
}
