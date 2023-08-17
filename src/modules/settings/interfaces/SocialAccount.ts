export interface SocialAccount {
  id: number
  name: string
  type: string
  value: string
  image: string
  blocked_at: boolean
  key?: string
}
