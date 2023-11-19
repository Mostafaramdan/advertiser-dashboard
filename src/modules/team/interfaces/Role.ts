export interface Role {
  id: number
  sort: number
  name: string
  is_active: boolean
}

interface Permission {
  label: string
  checked: boolean
  key: string
}

interface Group {
  title: string
  permissions: Permission[]
}

export interface PermissionListItem {
  title: string
  groups: Group[]
}
