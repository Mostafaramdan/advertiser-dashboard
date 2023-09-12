type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate: number
}

export interface AdsRequestsItem {
  id: number
  created_at: string
  price: number
  commission: number
  release_total: string
  ads_request_status: string
  payment_status: string
  payment_method: string
  user: User
  advertiser: User
}
