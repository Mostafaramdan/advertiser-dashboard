export interface AreaBase {
  name: {
    en: string
    ar: string
  }
  country_id: number
  area_code: number | null
  location_url: string
  is_active: boolean
}

export interface Area extends AreaBase {
  id: number
  sort: number
}
