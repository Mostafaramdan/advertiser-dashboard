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

// for pagination component
export interface PagePaginationProps {
  page: number
  metaData: MetaData | null
  getPageData: () => void
}

// File
export interface File {
  id: number
  file_type: string
  file_id: number
  path: string
  thumbnail: string
  type: string
  size: string
  name: string
  mimetype: string
  info?: string
  created_at: string
  updated_at: string
}
