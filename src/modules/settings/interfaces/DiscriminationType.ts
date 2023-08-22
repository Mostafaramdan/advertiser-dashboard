import type { File } from '@/interfaces/Shared'

export interface DiscriminationType {
  id?: number
  name: { en: string; ar: string }
  minimum: number | null
  maximum: number | null
  blocked_at?: boolean
  image_id?: number | null
  image?: File | null
}
