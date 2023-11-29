import { DropdownMenuItem } from '@/interfaces/Shared'
export interface TypeBase {
  name: string
  user_types: string[]
  is_active: boolean
}

export interface TypeFormData extends TypeBase {
  admins: number[]
}

export interface Type extends TypeBase {
  id: number
  sort: number
  admins: DropdownMenuItem[]
}
