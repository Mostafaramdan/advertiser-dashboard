import type { File } from '@/interfaces/Shared'

export interface Channel {
  id?: number
  name: { en: string; ar: string }
  followers_percentage: number | null
  channel_type: '1' | '2' | null
  is_active?: boolean
  image_id?: number | null
  image?: File | null
}
