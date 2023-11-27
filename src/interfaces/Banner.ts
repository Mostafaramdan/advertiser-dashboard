import { File } from './Shared'

export interface BannerBase {
  name: {
    ar: string
    en: string
  }
  from_date: string
  to_date: string
  is_active: boolean
  file_id: number | null
  file?: File | null
  link_type: null | 'internal' | 'external' | 'none'
  external_link?: string | null
  linkable_type: null | 'offers' | 'users'
  linkable_id: null | number
}

type AdvertiserModel = {
  id: number
  username: string
}

type OfferModel = {
  id: number
  name: string
}

export interface Banner extends BannerBase {
  id: number
  sort: number
  model: AdvertiserModel | OfferModel
}
