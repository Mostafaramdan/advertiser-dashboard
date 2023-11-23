export interface CategoryBase {
  name: { en: string; ar: string }
  is_active: boolean
  tags: { id: number; label: string }[] | number[]
}

export interface Category extends CategoryBase {
  id: number
  sort: number
}
