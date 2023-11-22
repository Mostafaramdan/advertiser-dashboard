import type { DropdownMenuItem, File, Location } from '@/interfaces/Shared'

export interface Employee {
  id: number
  gender: string
  personal_id: string
  code: string
  is_active: boolean
  type: string
  email: string
  phone: string
  name: string
  image_path: string
  roles: { id: number; label: string }[]
  role_category_name: string
  created_at: string
}

export interface EmployeeDetails {
  id: number
  gender: string
  personal_id: string
  code: string
  is_active: boolean
  type: string
  email: string
  phone: string
  name: string
  image_path: string
  created_at: string
  roles: DropdownMenuItem[]
  country: DropdownMenuItem
  area: DropdownMenuItem
  role_category: DropdownMenuItem
  image: File
  front_id_image: File
  back_id_image: File
  location: Location
}

export interface EmployeeFormProps {
  id?: number
  name: string
  email: string
  phone: string
  password: string
  type: null | string
  code: string
  image: File | null
  front_id_image: File | null
  back_id_image: File | null
  location: Location
  country_id: number | null
  area_id: number | null
  roles: number[]
  role_category_id: number | null
  gender: null | string
  personal_id: string
  image_id: number | null
  front_id_image_id: number | null
  back_id_image_id: number | null
  created_at?: string
}
