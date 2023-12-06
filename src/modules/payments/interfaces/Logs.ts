interface User {
  username: string
  role: 'user' | 'advertiser'
}

export interface LogsItem {
  id: number
  user: User
  other_user: User
  created_at: string
  payment_type: string
  type: string
  operation_type: string
  total: number
  commission: number
  points: number
  points_balance: number
}
