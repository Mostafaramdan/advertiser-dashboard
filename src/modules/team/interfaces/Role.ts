export interface Role {
  id: number
  sort: number
  name: string
  is_active: boolean
}

export interface Permission {
  label: string
  checked: boolean
  key: string
}

export interface PermissionsGroup {
  title: string
  permissions: Permission[]
}

export interface PermissionListItem {
  title: string
  groups: PermissionsGroup[]
}

export interface RoleFormData {
  name: string
  permissions: string[]
  is_active: boolean
}
