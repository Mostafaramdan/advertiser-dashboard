export interface BaseUnit {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface UnitListItem extends BaseUnit {
  id: number
}

export interface UnitFormData extends BaseUnit {
  id?: number
}
