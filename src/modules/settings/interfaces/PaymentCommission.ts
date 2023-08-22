export interface PaymentCommission {
  id?: number
  name: string
  value_in_platform: number | null
  value_out_platform: number | null
  minimum: number | null
  maximum: number | null
  value_key?: string
  is_active?: boolean
}
