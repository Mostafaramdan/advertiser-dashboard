export type SubscriptionsRequestStatusValue =
  | 'Accept'
  | 'Reject'
  | 'Vacation'
  | 'ActiveTemp'
  | 'StopTemp'
  | 'ActiveOnce'
  | 'Renew'
  | 'Extend'
  | 'Promotion'

export interface SubscriptionsRequestStatus {
  value: SubscriptionsRequestStatusValue
  label: string
  show: boolean
}

export interface SubscriptionsRequestItem {
  id: number
  package_id: number
  period_id: number
  created_at: string
  ended_at: string
  package_name: string
  total: number
  payment_status: number
  request_status: number
  user: {
    id: number
    username: string
    account_name: string
    email: string
    phone: string
    image_path: string
    role: string
    type: string
    gender: string
    country: string
    area_name: string
  }
  marketer_info: {
    id: number
    code: string
    user_id: number
    account_name: string
  } | null
}

export interface SubscriptionsRequestEditModalProps {
  payment_status: number | null
  request_status: any
  new_request_status: any
  stopped_from: string | null
  stopped_until: string | null
  free_days: number | null
  package_id: number | null
  period_id: number | null
}

export interface SubscriptionsLogsItem {
  id: number
  user_id: number
  packageName: string
  account_name: string
  period: string
  price: number
  payment_method: string
  created_at: string
  start_date: string
  type: string
  request_status: number
  remaining_days_str: string
}

export interface SubscriptionsLogsStats {
  subscribers_count: number
  m_payments: number
  m_annual_payments: number
  active_subscriptions: number
  expired_subscriptions: number
  suspended_subscriptions: number
}
