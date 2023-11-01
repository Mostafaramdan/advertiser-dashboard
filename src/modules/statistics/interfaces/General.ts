export interface DailyStatsData {
  subscriptions: {
    labels: string[]
    series: number[]
  }
  tickets: {
    new: number
    opened: number
    finished: number
    lated: number
    average_time_in_hours: number
    all: number
    finished_percentage: number
  }
  payments: {
    requests: number
    internal_payment: number
    external_payment: number
    commission: number
    subscriptions: number
    chart: {
      data: number[]
    }
    total_income: number
  }
}

export interface UsersCountriesStatsItem {
  id: number
  count: number
  name: string
  image_path: string
  percentage: number
}

export interface MonthlyStatsData {
  requests: {
    labels: string[]
    series: number[]
  }
  reports: {
    ads: number
    advertisers: number
    chats: number
    ads_content: number
  }
  advertisers_countries: UsersCountriesStatsItem[]
  users_countries: UsersCountriesStatsItem[]
}

export interface GeneralStatsData {
  stats: {
    advertisers: number
    users: number
    ads: number
    subscriptions: number
    subscribers: number
    stores_coupons: number
    ads_requests_coupons: number
    ads_requests: number
    disputes: number
    tickets: number
    ads_reports: number
    advertisers_reports: number
  }
  top_advertisers: {
    id: number
    username: string
    image_path: string
    ads_count: number
    requests_count: number
  }[]
}

export interface PaymentStatsCardProps {
  title: string
  amount: number
  icon: string
  color: string
  progress: number
}
