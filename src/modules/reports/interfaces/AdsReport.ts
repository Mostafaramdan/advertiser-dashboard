export interface AdsReport {
  id: number
  advertiser: {
    id: number
    username: string
    phone: string
    image_path: string
  }
  ads_description: string
  seen_count: number
  reports_count: number
  ad_id: number
  report_rate: number
  is_active_ad: boolean
  is_deleted: boolean
}
