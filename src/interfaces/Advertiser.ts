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

export interface AdvertiserStatsData {
  statistics: {
    sales_volume: number
    sales_in_platform: number
    sales_out_platform: number
    charge_total: number
    total_withdraw: number
    total_refunds: number
    current_total_wallet: number
    total_points_earned: number
    total_points_transferred: number
    wasted_points: number
    total_point_values_used: number
    total_prizes: number
  }
  statistics_ads_request: {
    total_ads_request: number
    in_progress_ads_requests: number
    finished_ads_requests: number
    refused_ads_requests_by_client: number
    refused_ads_requests_by_advertiser: number
    cancelled_ads_requests_by_client: number
    cancelled_ads_requests_by_advertiser: number
    disputed_ads_request: number
    ads_request_comments_count: number
    ads_request_replies_count: number
  }
  statistics_ads: {
    total_ads: number
    total_direct_ads: number
    total_inDirect_ads: number
    total_views: number
    total_reports: number
    total_rats: number
    average_rats: number | null
    average_reports: number
  }
  statistics_coupons: {
    total_ads_request_coupons: number
    total_my_coupons: number
    active_coupons: number
    inActive_coupons: number
    total_goes_coupons: number
    total_copies: number
    total_uses: number
    total_using_platform_coupons: number
    total_active_platform_coupons: number
  }
  statistics_Tickets_And_coupons: {
    total_tickets: number
    total_active_tickets: number
    total_finished_as_disputer: number
    total_finished_as_disputed: number
    total_active_disputes: number
  }
}

export interface AdRequestLogItem {
  id: number
  username: string
  created_at: string
  details: string
  action_type: string
}
