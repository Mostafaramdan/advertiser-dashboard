export interface UserWallet {
  id: number
  user: {
    id: number
    username: string
    image_path: string
    role: string
  }
  sales_total: number
  withdrawn_total: number
  purchases_total: number
  current_balance: number
  pending_balance: number
  withdrawn_balance: number
  transferred_points: number
  pending_points: number
  available_points: number
  shopping_code: string
}
