export interface OfferPaymentMethodBase {
  down_payment_percentage: number | null
  down_payment_delivering: string | null
  remaining_payment_delivering: string | null
  is_active: boolean
}

export interface OfferPaymentMethod extends OfferPaymentMethodBase {
  id: number
  sort: number
}
