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
