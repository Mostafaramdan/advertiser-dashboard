import { DropdownMenuItem } from '@/interfaces/Shared'
export interface CategoryBase {
  name: string
  user_types: string[]
  is_active: boolean
}

export interface CategoryFormData extends CategoryBase {
  name: string
  user_types: string[]
  admins: number[]
  is_active: boolean
}

export interface Category extends CategoryBase {
  id: number
  sort: number
  admins: DropdownMenuItem[]
}
