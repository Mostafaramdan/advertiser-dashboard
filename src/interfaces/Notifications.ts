export interface NotificationListItem {
  id: number
  body: string
  receiver: null | { username: string; role: string }
  created_at: string
  notification_type: string
  notification_category: string
  is_seen: boolean
}
export interface NotificationCreateModalProps {
  roles: string[]
  types: string[]
  entities: string[]
  packages: string[]
  notify_types: string[]
  title: string
  message: string
}

export interface DashboardNotification {
  id: number
  title: string
  body: string
  type: string
  is_seen: boolean
  created_at: string
  action_by: {
    id: number
    account_name: string
    image_path: string
    role: string
  }
  model_id: number
}
