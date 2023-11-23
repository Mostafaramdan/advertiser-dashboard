export interface TermsConditionsItemBase {
  name: string
  description: string
  type?: any
  is_active: boolean
}

export interface TermsConditionsItem extends TermsConditionsItemBase {
  id: number
  sort: number
}
