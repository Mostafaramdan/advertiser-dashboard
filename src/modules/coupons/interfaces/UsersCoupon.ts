interface User {
  id: number
  username: string
  account_name: string
  email: string
  phone: string
  image_path: string
}

export interface UserCoupon {
  id: number
  code: string
  discount: number | null
  started_at: string
  ended_at: string
  uses: number | null
  description: string
  is_active: boolean
  link: string
  goes_count: number
  likes_count: number
  dislikes_count: number
  shares_count: number
  status_text: string
  store: {
    id: number
    name: string
    image: string
  }
  category: {
    id: number
    label: string
  }
  advertiser: User
  user: User
}

export interface UserCouponFormProps {
  id?: number
  type: string
  category_id: number | null
  store_id: number | null
  is_active: boolean
}
