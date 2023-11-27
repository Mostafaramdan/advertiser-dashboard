export interface User {
  id: number
  username: string
  role: string
  email: string
  phone: string
  image_path: string
}

export interface Offer {
  id: number
  name: string
  image_path: string
  is_active: boolean
  offer_type: 'in' | 'out'
  status: string
  from_date: string
  to_date: string
  user: User
  main_price: number
  discount_price: number
}
