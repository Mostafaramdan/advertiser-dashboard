export interface User {
  id: number
  uuid: string
  name: string
  email: string
  image: string
  token: string
  created_at: string
  permissions: { accessible_pages: string[]; actions: string[] }
}
