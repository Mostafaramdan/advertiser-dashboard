export interface UserPoint {
  id: number
  user: {
    id: number
    username: string
    image_path: string
    role: string
  }
  current_points: number
  points_value: number
  earned_points: number
  earned_points_value: number
  equation: string
  currency: number
  transformed_points: number
  pending_points: number
  available_points: number
}
