export interface PlatformNewsItemBase {
  name: string
  description: string
  for: string[]
  is_active: boolean
}

export interface PlatformNewsItem extends PlatformNewsItemBase {
  id: number
  sort: number
}
