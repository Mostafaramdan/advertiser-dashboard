export interface PointsLogsItem {
  id: number
  user: {
    id: number
    username: string
    image_path: string
    role: string
  }
  action: {
    text: string
  }
  created_at: string
  total: string
  payment_type: string
  points: string
  points_ended_at: string
}
