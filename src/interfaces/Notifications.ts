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
