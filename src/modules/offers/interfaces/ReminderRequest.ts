export interface User {
  id: number
  username: string
  account_name: string
  phone: string
  image_path: string
  role: string
  email: string
}

export interface ReminderRequest {
  id: number
  type: string
  product: {
    id: number
    name: string
    from_date: string
    user: User
  }
  user: User
  emails: string[] | null
  from_quantity: number | null
  to_quantity: number | null
  is_archived: boolean
  created_at: string
}

export type RemindersRequestsStats = any
