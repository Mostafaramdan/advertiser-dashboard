export interface Area {
  id?: number
  blocked_at?: boolean
  sort?: number
  name: {
    en: string
    ar: string
  }
  country_id: number
  area_code: number | null
  location_url: string
}
