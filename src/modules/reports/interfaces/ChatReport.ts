type User = {
  id: number
  username: string
  account_name?: string
  email: string
  phone: string
  image_path: string
  rate?: number
  country_name?: string
  role?: string
}

export interface CharReport {
  id: number
  reporter: User
  reported: User
  report_date: string
  report_content: string
  message: string
}
