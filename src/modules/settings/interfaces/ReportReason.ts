export interface ReportReasonBase {
  name: { en: string; ar: string }
  is_active: boolean
}

export interface ReportReason extends ReportReasonBase {
  id: number
  sort: number
}
