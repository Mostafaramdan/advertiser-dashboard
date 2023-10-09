export type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  country_name?: string
  role?: string
}

export interface ChatBlock {
  id: number
  blocks_count: number
  blocked: User
}

export interface ChatBlockItem {
  id: number
  blocker: User
  created_at: string
}
