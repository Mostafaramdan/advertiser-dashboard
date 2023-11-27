import { File } from '@/interfaces/Shared'

export interface StoreBase {
  name: { en: string; ar: string }
  from_app: boolean
  is_active: boolean
  image_id?: number | null
  image?: File | null
}

export interface Store extends StoreBase {
  id: number
}
