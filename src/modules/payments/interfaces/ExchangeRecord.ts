export interface ExchangeRecord {
  id: number
  user: {
    id: number
    username: string
    role: 'user' | 'advertiser'
  }
  created_at: string
  total: number
  currency: string
  status: string
  type: string
  card: {
    type: string
    label: string
  }
}

export interface ExchangeRecordDetails {
  id: number
  area: string
  username: string
  total: number
  created_at: string
  status: string
  points: number
  points_value: number
}

export interface ExchangeRecordWithdrawData {
  total_balance: number
  wallet: number
  available_withdraw: number
  pending_balance: number
  request_total: number
}

export interface ExchangeRecordFormData {
  user_id: null | number
  payment_amount: null | number
  request_id: null | number
  billing_card_id: null | number
}
