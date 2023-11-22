import { DropdownMenuItem } from './Shared'

export interface User {
  id: number
  uuid: string
  name: string
  email: string
  image_path: string
  token: string
  created_at: string
  permissions: string[]
  roles: DropdownMenuItem[]
}
