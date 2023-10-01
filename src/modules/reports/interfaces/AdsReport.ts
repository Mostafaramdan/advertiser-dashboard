type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate?: number
  country_name?: string
  role?: string
}

export interface AdsReport {
  id: number
  advertiser: User
  ads_description: string
  seen_count: number
  reports_count: number
  ad_id: number
  report_rate: number
  is_active_ad: boolean
  is_deleted: boolean
}

export interface AdReportItem {
  id: number
  reporter: User
  created_at: string
  report_content: string
}
