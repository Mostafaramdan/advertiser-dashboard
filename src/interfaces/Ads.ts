type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate: number
  country_name?: string
}

export interface AdsListItem {
  id: number
  ads_locations: {
    show_app: boolean
    show_profile: boolean
  } | null
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
  is_deleted: boolean
}

export interface AdDetails extends AdsListItem {
  updated_count: number | null
  dislikes_count: number
  likes_count: number
  attachments: {
    id: number
    type: string
    path: string
    thumbnail: string
  }
  country_name: string
  reports_count: number
  reports_percentage: number
  ads_request_id: number | null
  location: {
    lat: number
    lng: number
    address: string
  } | null
  description: string
}

export interface AdComment {
  id: number
  comment: string
  commenter: User
  created_at: string
  likes_count: number
}
