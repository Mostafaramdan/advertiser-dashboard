export interface Country {
  id: number
  name: {
    ar: string
    en: string
  }
  sort: number
  country_categories: {
    ar: string
    en: string
  }[]
  phone_key: string
  timezone: string
  iso_name: string
  image: string
  google_map: string
  is_active: boolean
  areas_count: number
}
