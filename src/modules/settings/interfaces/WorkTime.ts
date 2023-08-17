export interface WorkTime {
  id: number
  day: number
  is_vacation: boolean
  from_time: string
  to_time: string
}

export interface WorkTimeData {
  data: WorkTime[]
  show: boolean
}
