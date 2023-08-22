export interface Question {
  id?: number
  question: string
  answer: string
  for: string[]
  category?: { name: string; id: number }
  category_id?: number | null
  is_active?: boolean
}
