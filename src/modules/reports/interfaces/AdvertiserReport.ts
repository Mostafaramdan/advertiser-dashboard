type User = {
  id: number
  username: string
  account_name: string
  email: string
  phone: string
  image_path: string
  rate?: number
  country_name?: string
  role?: string
}

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

export interface AdvertiserReportItem {
  id: number
  reporter: User
  created_at: string
  report_content: string
}
