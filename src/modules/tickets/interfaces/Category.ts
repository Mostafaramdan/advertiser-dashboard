export interface Category {
  id?: number
  sort?: number
  name: string
  user_types: string[]
  admins:
    | {
        id: number
        label: string
      }[]
    | number[]
  is_active: boolean
}
