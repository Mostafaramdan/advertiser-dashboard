import { DropdownMenuItem } from '@/interfaces/Shared'

export interface User {
  id: number
  username: string
  account_name: string
  image_path: string
  role: string
  phone?: string
  email?: string
}

export interface AdsSpace {
  id: number
  name: string
  image_path: string
  is_active: boolean
  watches_count: number
  remaining_watches_count: number
  balance: number
  created_at: string
  user: User
}

export interface AdsSpaceDetails {
  channels: {
    id: number
    name: string
    image_path: string
  }[]
  from_date: string
  to_date: string
  location: { lat: number; lng: number; address: string } | null
  request_watch_distance_status: boolean
  request_watch_distance: number
  share_distance_status: boolean
  share_distance: number
  automatic_minimum: number
  automatic_maximum: number
  manual_minimum: number
  manual_maximum: number
  share_statistics: boolean
  share_rate: boolean
  user_repeat: boolean
  repeat_type: 'day' | 'week' | 'month' | 'year'
  watch_price: number
  currency_name: string
  watches_count: number
  hide_comments: boolean
  can_whatsapp: boolean
  can_chat: boolean
  can_add_balance: boolean
  brief: null | string
  attachments: {
    id: number
    path: string
    thumbnail: string
    name: string
  }[]
  categories: DropdownMenuItem[]
  description: string
  shares_count: number
  shares_watches_count: number
  rate: number | null
}

export interface AdsSpaceStats {
  space_created_at: string
  total_days: number
  participants_count: number
  shares_confirmed: number
  watches_count: number
  snapchat_watches: number
  instagram_watches: number
  beTrend_watches: number
  total_balance: number
  transfer_balance: number
  pending_balance: number
  withdrawable_balance: number
}

export interface AdSpaceRequest {
  id: number
  user: User
  created_at: string
  ended_at: string
  watches_count_requested: number
  remaining_hours: number
  watch_price: number
  remaining_watches_count: number
  shares_watches_count: number
  currency_name: string
  status: string
  channels: {
    id: number
    url: string
    watches_count: number
    is_confirmed: boolean
    channel: {
      label: string
      image_path: string
    }
  }[]
}

export interface AdSpaceRequestLog {
  id: number
  user: User
  created_at: string
  action_type_trans: string
}
