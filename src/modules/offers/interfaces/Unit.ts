export interface UnitBase {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface Unit extends UnitBase {
  id: number
  sort: number
}
