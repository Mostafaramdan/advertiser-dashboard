export interface OfferDeadlineBase {
  hours: number | null
  from_time: string | null
  is_active: boolean
}

export interface OfferDeadline extends OfferDeadlineBase {
  id: number
  sort: number
}
