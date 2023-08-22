import type { File } from '@/interfaces/Shared'

export interface PlatformInfo {
  verified_users: number
  registered_at_marouf: number
  total_users: number
  total_rate: number
  wallet: number
  points_balance: number
  active: number
  inactive: number
  complete: number
  complete_percent: number
  logo: string | null
}

export interface platformFormItem { value: string; show: boolean }

export interface PlatformFormData {
  name_ar: platformFormItem
  name_en: platformFormItem
  email: platformFormItem
  unified_number: platformFormItem
  address: platformFormItem
  fax: platformFormItem
  whatsapp: platformFormItem
  tax_registration_number: platformFormItem
  commercial_registration_number: platformFormItem
  logo: File | null
}

export type PaymentGetWay = 'bank' | 'card' | 'apple_pay' | 'stc_pay' | null

export interface PaymentMethod {
  id?: number
  gateway?: PaymentGetWay
  iban?: string
  bank_username?: string
  bank_name?: string
  card_number?: string
  card_username?: string
  expiration_date: string
  phone?: string
  icloud?: string
  cvv?: string
  is_active: boolean
}
