export interface PartnerBase {
  name: string
  description: string
  is_active: boolean
}

export interface Partner extends PartnerBase {
  id: number
  sort: number
}
