import type { File } from '@/interfaces/Shared'

export interface SubscriptionsListItem {
  id: number
  image: File | string | null
  name: {
    ar: string
  }
  created_at: string
  subscribers_count: number
  subscriptions_total: number
  is_active: boolean
  is_default: boolean
}
