export interface Area {
  id?: number
  is_active?: boolean
  sort?: number
  name: {
    en: string
    ar: string
  }
  country_id: number
  area_code: number | null
  location_url: string
}
