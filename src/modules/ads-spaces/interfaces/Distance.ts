export interface DistanceBase {
  value: string
  is_active: boolean
}

export interface Distance extends DistanceBase {
  id: number
  sort: number
}
