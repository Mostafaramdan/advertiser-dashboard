export interface SettingsListItem {
  id: string
  name: string
  value: number
  value_key: string
  is_active: boolean
  has_input?: boolean
  has_radio?: boolean
  options?: any
  check_value?: any
  is_text_editor?: boolean
  min_value?: number
  max_value?: number
}
