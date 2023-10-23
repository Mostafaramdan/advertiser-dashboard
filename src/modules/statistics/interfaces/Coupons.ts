import type { ChartsData, StatsTableListItem } from './Statistics'

export interface CouponItem {
  id: number
  type: string
  store_name: string
  copies: number
  goes: number
  shares: number
  likes: number
  dislikes: number
  user: string
}

export interface AdvertiserStat {
  id: number
  stores: number
  count: number
  copies: number
  goes: number
  shares: number
  likes: number
  dislikes: number
  user: string
}

export interface ClientStat extends AdvertiserStat {
  id: number
}

export interface CouponsData {
  charts: ChartsData
  statistics: {
    counters: StatsTableListItem[]
    most_used: CouponItem[]
    advertisers: AdvertiserStat[]
    clients: ClientStat[]
  }
}
