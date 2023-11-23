export interface CategoryBase {
  name: string
  is_active: boolean
}

export interface Category extends CategoryBase {
  id: number
  sort: number
}
