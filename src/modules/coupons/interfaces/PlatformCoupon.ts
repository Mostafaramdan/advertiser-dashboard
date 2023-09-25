import { File } from '@/interfaces/Shared'

export interface PlatformCoupon {
  id?: number
  code: string
  discount: number | null
  started_at: string
  ended_at: string
  uses: number | null
  description: string
  marketer_ratio: number | null
  is_active?: boolean
  image_id?: number | null
  image?: File | null
  type?: string
}

export interface SubscribersHistoryItem {
  id: number
  uses_count: number
  orders_total: number
  discount_total: number
  payment_total_in: number
  payment_total_out: number
  status: string
  advertiser: {
    id: number
    username: string
    account_name: string
  }
}
export interface OperationsHistoryItem {
  id: number
  user: { username: string; role: string }
  advertiser: { username: string; role: string }
  ads_request_id: number
  total: number
  discount: number
  provider_cost: number
  platform_cost: number
  created_at: string
}
