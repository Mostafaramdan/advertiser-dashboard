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
  total: string
  commission: string
  points: string
  points_balance: string
}

export interface LogsStats {
  sales_total: string
  withdrawn_total: string
  charge_total: string
  purchases_total: string
  current_total_wallet: string
  pending_balance_total: string
  available_withdrawn: string
  platform_income: string
}
