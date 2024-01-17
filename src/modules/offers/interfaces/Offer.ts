import { FormModalProps } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import type { Responsible } from './Responsible'
export interface User {
  id: number
  username: string
  account_name?: string
  role: string
  email: string
  phone: string
  image_path: string
  rate?: number
  area_name?: string
}

type OfferType = 'in_platform' | 'out_platform'
type ProductCondition = 'new_product' | 'used_product' | 'expires_soon'

export interface Offer {
  id: number
  image_path: string
  is_active: boolean
  offer_type: OfferType
  status: string
  from_date: string
  to_date: string
  user: User
  is_deleted: boolean
  products_count: number
  accepted_products_count: number
  rejected_products_count: number
}

export interface OfferDetailsBase {
  image: File | null
  name: string
  from_date: string
  to_date: string
  expire_date: string
  is_active: boolean
  hide_contact_data: boolean
  description: string
  store: {
    name: string
    url: string
    type: null | 'website' | 'marketplace'
  }
  responsible: {
    name: string
    email: string
    phone: string
    hide_name: boolean
    hide_email: boolean
    hide_phone: boolean
  }
  offer_type: OfferType | null
  product_condition: null | ProductCondition
  main_price: number | null
  discount_price: number | null
  offer_quantity: number | null
  show_offer_quantity: boolean
  available_quantity: number | null
  show_available_quantity: boolean
  minimum_quantity: number | null
  maximum_quantity: number | null
  sub_unit_value: number | null
}

export type OfferStoreType = 'website' | 'marketplace' | null

export type OfferProduct = {
  id: number
  image_path: string
  name: string
  main_price: number
  discount_price: number
  status: string
  is_active: boolean
  accepted?: boolean
  can_accept_or_reject?: boolean
  can_change_status?: boolean
  can_change_quantity_status?: boolean
  can_edit?: boolean
  show_available_quantity?: boolean
}
export interface OfferFormData {
  offer_type: OfferType | null
  store: {
    name: string
    type: OfferStoreType
  }
  from_date: string
  to_date: string
  is_active: boolean
  user_id: number | null
  products: OfferProduct[]
}

type FixedPrice = {
  main_price: number | null
  discount_price: number | null
  minimum_quantity: number | null
  maximum_quantity: number | null
}

export type ProductPrice = {
  id?: number
  label?: string
  minimum_quantity: number | null
  maximum_quantity: number | null
  price: number | null
}

export type ProductPricingType = 'fixed' | 'segments' | null

export interface ProductFormData {
  offer_id?: number | null
  user_id: number | null
  name: string
  category_id: number | null
  link: string | null
  attachments: number[]
  description: string
  product_data: {
    warranty_and_expiration: {
      product_condition: null | ProductCondition
      expire_date: string
      production_date: string
      warranty_duration: number | null
      warranty_duration_type: string | null
    }
    unit_details: {
      product_quantity: number | null
      main_unit_id: number | null
      sub_unit_id: number | null
      sub_unit_value: number | null
    }
    dimensions: {
      height: number | null
      width: number | null
      length: number | null
      weight: number | null
      weight_unit: string | null
    }
  }
  preferences: {
    payment_method_id: number | null
    deadline_id: number | null
    responsibles: Responsible[]
    preferences: {
      show_available_quantity: boolean
      create_instant_invoice: boolean
      show_product_quantity: boolean
      hide_contact_data: boolean
      api_connection: boolean
      print_invoice: boolean
      qr: boolean
    }
    request_acceptance_method: {
      manually: boolean
      automatically: boolean
      min_manually: number | null
      max_manually: number | null
      min_automatically: number | null
      max_automatically: number | null
    }
  }
  pricing: {
    fixed: FixedPrice
    prices: ProductPrice[]
    pricing_type: ProductPricingType
  }
  shipping_range: {
    countries: number[]
    areas: number[]
    branches: number[]
    has_delivery: boolean
    has_branches: boolean
  }
  attachmentsFiles: File[] | any[]
}

export type OfferDetails = any
export interface OfferLogsItem {
  id: number
  action_name: string
  created_at: string
  details: string
  action_by: User
}

export interface ProductNotesItem {
  id: number
  created_at: string
  note: string
  admin: User
}

export interface OfferNoteCreteData {
  note: string
}

export interface OfferNoteUpdateData {
  id: number
  note: string
}

export interface OfferNoteModalProps extends FormModalProps {
  productId: number
}

export interface OfferNoteModalPayload {
  productId: number
  data: OfferNoteCreteData | OfferNoteUpdateData
}

export interface OfferStatsData {
  created_at: string
  days_count: number
  offer_type: OfferType
  posts_count: number
  product_condition: ProductCondition
  seen_count: number
  goes_count: number
  shares_count: number
  reports_count: number
  rate: number | null
  rate_count: number
  offer_start_reminder_count: number
  offer_availability_reminder_count: number
  offer_open_chats_count: number
  favorites_count: number
  user_favorites_count: number
}

export interface OfferAcceptModalProps {
  offerId: number
  showModal: boolean
}

export interface OfferAcceptModalFormData {
  from_date: string | null
}

export interface OfferAcceptModalFormPayload {
  offerId: number
  data: OfferAcceptModalFormData
}

export interface OfferPermissionsFormData {
  store_type: boolean
  offer_date: boolean
  main_data: boolean
}

export interface ProductPermissionsFormData {
  attachments_and_image: boolean
  connect_with_accounting_service: boolean
  create_invoice_and_add_client: boolean
  decrease_prices: boolean
  description: boolean
  expire_date: boolean
  increase_available_quantity: boolean
  main_data: boolean
  multiple_product_instant_invoices: boolean
  print_invoices: boolean
  product_data: boolean
  qr: boolean
  quantity_limits: boolean
  responsible: boolean
  share_invoice: boolean
  shipping_range: boolean
  toggle_show_quantity: boolean
}
