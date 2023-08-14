export interface SettingsListItem {
  id: string
  name: string
  value: number
  value_key: string
  blocked_at: boolean
  has_input?: boolean
  has_radio?: boolean
  options?: any
  check_value?: any
}
