import type { File } from '@/interfaces/Shared'

export interface VideoListItem {
  id: string
  label: string
}

export interface Video {
  id?: number
  name: string
  show_in: VideoListItem | null | string
  for: string[]
  is_active?: boolean
  video_id?: number | null
  video?: File | null
}
