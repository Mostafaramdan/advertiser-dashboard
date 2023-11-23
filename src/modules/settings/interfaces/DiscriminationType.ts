import type { File } from '@/interfaces/Shared'

export interface DiscriminationTypeBase {
  name: { en: string; ar: string }
  minimum: number | null
  maximum: number | null
  is_active: boolean
  image_id?: number | null
  image?: File | null
}

export interface DiscriminationType extends DiscriminationTypeBase {
  id: number
  sort: number
}
