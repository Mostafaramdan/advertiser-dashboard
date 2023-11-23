import type { DropdownMenuItem, File } from '@/interfaces/Shared'

export interface VideoBase {
  name: string
  show_in: DropdownMenuItem | null | string
  for: string[]
  is_active: boolean
  video_id?: number | null
  video?: File | null
}

export interface Video extends VideoBase {
  id: number
  sort: number
  show_in: DropdownMenuItem
  video: File
}
