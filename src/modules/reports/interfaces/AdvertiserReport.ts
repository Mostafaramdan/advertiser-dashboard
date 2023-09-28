export interface AdvertiserReport {
  id: number
  advertiser: {
    id: number
    username: string
    phone: string
    image_path: string
  }
  reported_count: number
  ads_request_count: number
  reported_rate: number
}
