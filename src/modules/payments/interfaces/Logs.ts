interface User {
  username: string
  role: 'user' | 'advertiser'
  image_path?: string
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
  type_key: string
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

export type counterItem = {
  title: string
  value: any
}

type BankAccount = {
  id: number
  type: string
  info: {
    ipan: string
    name: string
    type: string
    swift_code: string | null
    account_name: string
  }
}

export interface LogWithdrawnItem {
  request_id: number
  operation_type: string
  user: User
  counters: {
    request_id: counterItem
    total_sales: counterItem
    total_withdraw: counterItem
    available_withdraw: counterItem
    total_returns: counterItem
    pending_wallet: counterItem
    current_wallet: counterItem
  }
  details: {
    counters: {
      withdrawen_total: counterItem
      expense_total: counterItem
    }
    bank_accounts: BankAccount[]
  }
}

export interface LogRequestItem {
  request_id: number
  operation_type: string
  status_txt: string
  payment_method: string
  user: User
  advertiser: User
  counters: {
    date: counterItem
    total: counterItem
    commission: counterItem
    advertiser_points: counterItem
    user_points: counterItem
    markter_points: counterItem
  }
}
