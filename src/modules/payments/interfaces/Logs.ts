export interface User {
  username: string
  role: 'user' | 'advertiser'
  image_path?: string
}

interface DynamicKeysObject<T> {
  [key: string]: T
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

export type CounterItem = {
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
  title: string
  user: User
  counters: {
    request_id: CounterItem
    total_sales: CounterItem
    total_withdraw: CounterItem
    available_withdraw: CounterItem
    total_returns: CounterItem
    pending_wallet: CounterItem
    current_wallet: CounterItem
  }
  details: {
    counters: DynamicKeysObject<CounterItem>
    bank_accounts: BankAccount[]
  }
}

export interface LogRequestItem {
  request_id: number
  operation_type: string
  title: string
  status_txt: string
  payment_method: string
  user: User
  advertiser: User
  counters: DynamicKeysObject<CounterItem>
}

export interface LogRefundItem {
  request_id: number
  operation_type: string
  title: string
  user: User
  total: number
  dispute_request_id: number
  request_details: string
  counters: DynamicKeysObject<CounterItem>
  details: {
    counters: DynamicKeysObject<CounterItem>
    bank_accounts: BankAccount[]
  }
}

export interface LogChargeItem {
  operation_type: string
  title: string
  user: User
  counters: DynamicKeysObject<CounterItem>
  details: {
    counters: DynamicKeysObject<CounterItem>
  }
}

export interface LogDefaultItem {
  operation_type: string
  title: string
  user: User
  advertiser: User
  counters: DynamicKeysObject<CounterItem>
  details: {
    counters: DynamicKeysObject<CounterItem>
  }
}

export interface LogSubscriptionItem {
  operation_type: string
  title: string
  package: {
    id: number
    title: string
  } | null
  points: number
  user: User
  counters: DynamicKeysObject<CounterItem>
  details: {
    counters: DynamicKeysObject<CounterItem>
  }
}

export interface LogMarkterCommissionItem {
  operation_type: string
  title: string
  user: User
  advertiser: User
  payment_method: string
  status_txt: string
  request_id: number
  counters: DynamicKeysObject<CounterItem>
  details: {
    counters: DynamicKeysObject<CounterItem>
  }
}
