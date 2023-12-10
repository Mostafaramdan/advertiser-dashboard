export interface ExchangeRecord {
  id: number
  user: {
    username: string
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
