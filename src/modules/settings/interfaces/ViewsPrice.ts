export interface ViewsPriceBase {
  value: string
  is_active: boolean
}

export interface ViewsPrice extends ViewsPriceBase {
  id: number
  sort: number
}
