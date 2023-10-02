type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate?: number
  country_name?: string
  role?: string
}

export interface ChatRate {
  id: number
  employee: User
  rater: User
  created_at: string
  rated_average_rate: number
  comment: string
}
