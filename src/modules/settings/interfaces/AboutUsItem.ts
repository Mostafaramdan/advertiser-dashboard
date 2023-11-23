export interface AboutUsItemBase {
  id?: number
  name: string
  description: string
  for: string[]
  is_active: boolean
}

export interface AboutUsItem extends AboutUsItemBase {
  id: number
  sort: number
}
