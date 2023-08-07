// pagination: MetaData
export interface MetaData {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// for pageActions Component
export interface pageAction {
  icon: string
  show: boolean
  handler: any
  loading?: boolean
  disabled?: boolean
}

export interface PageActionsProps {
  perPageOptions?: number[]
  itemsPerPage?: number
  pageActionsButtons?: pageAction[]
  model?: string
  selectedItems?: number[]
  showMultiDelete?: boolean
  showMultiActivate?: boolean
}
