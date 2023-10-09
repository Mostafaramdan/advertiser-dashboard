type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  country_name?: string
  role?: string
}

export interface AdsBlock {
  id: number
  blockings_count: number
  blocked: User
}
