export interface Category {
  id?: number
  name: { en: string; ar: string }
  type: string[]
  blocked_at?: boolean
}
