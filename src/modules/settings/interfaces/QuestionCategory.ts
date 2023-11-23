export interface QuestionCategoryBase {
  name: string
  for: string[]
  is_active: boolean
}

export interface QuestionCategory extends QuestionCategoryBase {
  id: number
  sort: number
}
