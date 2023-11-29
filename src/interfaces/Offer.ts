import type { File } from './Shared'
export interface User {
  id: number
  username: string
  role: string
  email: string
  phone: string
  image_path: string
}

type OfferType = 'in' | 'out'

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
}

export interface OfferFormData {
  image: File | null
  image_id: number | null
  name: string
  offer_type: OfferType | null
  from_date: string
  to_date: string
  user_id: number | null
  category_id: number | null
  description: string
  product_status: null | 'new' | 'used' | 'expiry'
  used_description: string
  expire_date: string
  is_active: boolean
  hide_contact_data: boolean
  store: {
    name: string
    url: string
    type: null | 'website' | 'marketplace'
  }
  location: {
    lat: number
    lng: number
    address: string
  }
  countries: number[]
  areas: number[]
  main_unit_id: number | null
  sub_unit_id: number | null
  sub_unit_value: number | null
  main_price: number | null
  discount_price: number | null
  offer_quantity: number | null
  show_offer_quantity: boolean
  available_quantity: number | null
  show_available_quantity: boolean
  minimum_quantity: number | null
  maximum_quantity: number | null
  responsible: {
    name: string
    email: string
    phone: string
    hide_name: boolean
    hide_email: boolean
    hide_phone: boolean
  }
  prices: {
    minimum_quantity: number | null
    maximum_quantity: number | null
    price: number | null
  }[]
  attachments: number[]
  attachmentsFiles: File[] | any[]
}
