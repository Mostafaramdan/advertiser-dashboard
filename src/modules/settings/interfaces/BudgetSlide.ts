export interface BudgetSlideBase {
  from: number | null
  to: number | null
  is_active: boolean
}

export interface BudgetSlide extends BudgetSlideBase {
  id: number
  sort: number
}
