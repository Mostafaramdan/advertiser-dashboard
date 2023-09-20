import { File } from '@/interfaces/Shared'

export interface PlatformCoupon {
  id?: number
  code: string
  discount: number | null
  started_at: string
  ended_at: string
  uses: number | null
  description: string
  marketer_ratio: number | null
  is_active?: boolean
  image_id?: number | null
  image?: File | null
  type?: string
}
