export interface Advertiser {
  id: number
  phone: string
  email: string
  created_at: string
  rate: number
  account_name: string
  image_path: string | null
  country_name: string
  area_name: string
  purchases: number
  sales: number
  user_requests: number
  is_deleted: boolean
  is_active: boolean
  advertiser_requests: number
  followers_count: number
  ads_count: number
}

export interface AdvertiserBasicData {
  id: number
  subscription_end_date: string | null
  image_path: string | null
  username: string
  email: string
  phone: string
  created_at: string
  is_active: boolean
  is_deleted: boolean
}

export interface AdvertiserDetails {
  id: number
  followers_count: number
  ads_count: number
  rate: number
  wallet: number
  points_balance: number
  subscription_status: string
  profile_completion: number
  email: string
  phone: string
  username: string
  account_name: string
  country_name: string
  area_name: string
  type: string
  subscription_name: string
  ads_request_count: number
  reported_count: number
  reported_rate: string
  ma3roof_data: {
    link: string
    name: string
  } | null
  can_be_marketer: boolean
  procedures: {
    ma3roof_verified: boolean
    verified: boolean
    licensed_at_mawthoq: boolean
    trustes_settings: boolean
  }
  bank_account: {
    account_name: string
    iban: string
    name: string
    swift_code: string
    type: string
  } | null
  tax_settings: {
    tax_enabled: boolean
    tax_number: string
    tax_percentage: number
  } | null
}

export interface MarketingPresentationInfo {
  code: string
  time_in_months: number | null
  end_date: string
  points: number | null
}

export interface AccountSettingsData {
  channels: {
    id: number
    type: string
    is_active: boolean
    name: string
    link: string
    followers_count: number
    channel: {
      id: number
      name: string
      image_path: string
    }
  }[]
  categories: {
    id: number
    name: string
  }[]
  countries: {
    id: number
    name: string
  }[]
  areas: {
    id: number
    name: string
  }[]
}
