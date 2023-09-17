type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate: number
}

export interface AdsListItem {
  id: number
  ads_locations: {
    show_app: boolean
    show_profile: boolean
  }
  advertiser: User
  user: User | null
  ads_type: string
  category_name: string | null
  started_at: string
  ended_at: string | null
  seen_count: number
  status_txt: string
  is_active: boolean
  rate: number
  image_path: string
}
