export interface User {
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
  gender: 'male' | 'female'
}

export interface UserBasicData {
  id: number
  image_path: string | null
  username: string
  email: string
  phone: string
  created_at: string
  is_active: boolean
  is_deleted: boolean
}
export interface UserDetails {
  id: number
  sales: number
  purchases: number
  user_requests: number
  rate: number
  wallet: number
  points_balance: number
  email: string
  phone: string
  username: string
  account_name: string
  country_name: string
  area_name: string
  type: string
  gender: string
}

export interface LicenseDocument {
  id: number
  name: string
  number: number
  ended_at: string | null
  remaining_days: number
  updated_at: string | null
  last_notified_at: string | null
  file_path: string | null
  is_active: boolean
}
export interface LicenseDocumentNotification {
  id: number
  admin_name: string
  created_at: string
  channels: string[]
  message: string
}

export interface LicenseDocumentNote {
  id: number
  admin_name: string
  created_at: string
  note: string
}
export interface LogsHistoryItem {
  id: number
  created_at: string
  action_by: string | null
  action: string
}

export interface AdRequestLogItem {
  id: number
  username: string
  created_at: string
  details: string
  action_type: string
}

export interface ChatBlockLogsItem {
  id: number
  reporter: {
    id: number
    username: string
    email: string
    phone: string
    image_path: string
    country_name: string
  }
  created_at: string
  report_content: string
}
