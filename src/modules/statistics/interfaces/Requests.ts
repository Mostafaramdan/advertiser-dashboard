import type { ChartsData, StatsTableListItem } from './Statistics'

type PaymentInfo = {
  payments_in: number
  payments_out: number
  discounts_total: number
  discounts_app: number
  discounts_bill: number
}

type Country = {
  name: string
  image: string
}

export interface TopRequestsFromClient {
  id: number
  name: string
  country: Country
  area: string
  requests: number
  payments_in: number
  payments_out: number
  discounts_app: number
  discounts_bill: number
  discounts_total: number
  prizes: number
}

export interface TopRequestsFromAdvertiser {
  id: number
  name: string
  country: Country
  area: string
  requests_as_client: number | null
  requests_as_advertiser: number | null
  prizes_from: number
  prizes_to: number
  as_client: PaymentInfo
  as_advertiser: PaymentInfo
}

export interface RequestsData {
  charts: ChartsData
  statistics: {
    counters: StatsTableListItem[]
    top_requests_from_clients: TopRequestsFromClient[]
    top_requests_from_advertisers: TopRequestsFromAdvertiser[]
  }
}
