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
