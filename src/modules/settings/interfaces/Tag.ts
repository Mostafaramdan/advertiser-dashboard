export interface TagBase {
  id?: number
  sort?: number
  name: { en: string; ar: string }
  is_active: boolean
  can_control?: boolean
}

export interface Tag extends TagBase {
  id: number
  sort: number
}
