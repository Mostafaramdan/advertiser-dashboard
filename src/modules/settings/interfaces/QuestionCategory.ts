export interface QuestionCategoryBase {
  name: string
  user_types: string[]
  is_active: boolean
}

export interface QuestionCategory extends QuestionCategoryBase {
  id: number
  sort: number
}
