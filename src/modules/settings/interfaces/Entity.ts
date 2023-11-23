export interface EntityBase {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface Entity extends EntityBase {
  id: number
  sort: number
}
