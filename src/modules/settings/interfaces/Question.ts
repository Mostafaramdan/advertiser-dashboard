export interface QuestionBase {
  question: string
  answer: string
  for: string[]
  category?: { name: string; id: number }
  category_id?: number | null
  is_active: boolean
}

export interface Question extends QuestionBase {
  id: number
  sort: number
}
