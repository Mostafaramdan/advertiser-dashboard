export interface AdsSpace {
  id: number
  name: string
  image_path: string
  is_active: boolean
  watches_count: number
  remaining_watches_count: number
  balance: number
  created_at: string
  user: {
    id: number
    username: string
    image_path: string
    role: string
  }
}
