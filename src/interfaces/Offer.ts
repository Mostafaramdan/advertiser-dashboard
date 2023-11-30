import type { DropdownMenuItem, File, Location } from './Shared'
export interface User {
  id: number
  username: string
  role: string
  email: string
  phone: string
  image_path: string
}

type OfferType = 'in_platform' | 'out_platform'

export interface Offer {
  id: number
  name: string
  image_path: string
  is_active: boolean
  offer_type: OfferType
  status: string
  from_date: string
  to_date: string
  user: User
  main_price: number
  discount_price: number
  category_name: string
  is_deleted: boolean
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
  location: Location
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
  product_condition: null | 'new_product' | 'used_product' | 'expires_soon'
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

export interface OfferFormData extends OfferDetailsBase {
  image_id: number | null
  user_id: number | null
  category_id: number | null
  countries: number[]
  areas: number[]
  main_unit_id: number | null
  sub_unit_id: number | null
  prices: {
    minimum_quantity: number | null
    maximum_quantity: number | null
    price: number | null
  }[]
  attachments: number[]
  attachmentsFiles: File[] | any[]
}

export interface OfferDetails extends OfferDetailsBase {
  user: User
  category: DropdownMenuItem
  countries: DropdownMenuItem[]
  areas: DropdownMenuItem[]
  main_unit: DropdownMenuItem
  sub_unit: DropdownMenuItem
  prices: {
    minimum_quantity: number
    maximum_quantity: number
    price: number
  }
  attachments: File[]
  created_at: string
  is_deleted: boolean
  status: string
}
