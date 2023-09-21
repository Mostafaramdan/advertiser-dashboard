import { File } from '@/interfaces/Shared'

export interface Store {
  id?: number
  name: { en: string; ar: string }
  from_app: boolean
  is_active?: boolean
  image_id?: number | null
  image?: File | null
}
