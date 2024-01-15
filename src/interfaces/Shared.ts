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
  searchPlaceholder?: string
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
  is_vimeo?: boolean
}

// page tab nav item
export interface PageTabNavItem {
  title: string
  show: boolean | any
  to: any
}

// Geo Location Modal
export interface Location {
  lat: number
  lng: number
  address: string
}
export interface GeoLocationModalProps {
  showModal: boolean
  location: Location
}

// notifiction modal
export interface NotificationModalProps {
  showModal: boolean
  extraData?: object
  defaultMessage?: string
  showNotificationTypes?: boolean
  defaultSelectedType?: string
  url?: string | null
  user: {
    email: string
    username: string
    phone: string
    image_path: string | null
    id: number
  }
}

export interface DropdownMenuItem {
  id: number
  label: string
}
