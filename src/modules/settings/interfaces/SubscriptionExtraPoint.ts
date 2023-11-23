export interface SubscriptionExtraPointBase {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface SubscriptionExtraPoint extends SubscriptionExtraPointBase {
  id: number
  sort: number
}
