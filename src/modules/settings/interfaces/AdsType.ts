export interface AdsTypeBase {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface AdsType extends AdsTypeBase {
  id: number
  sort: number
}
