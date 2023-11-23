export interface AccountCaseBase {
  name: { en: string; ar: string }
  message: { en: string; ar: string }
  is_active: boolean
}

export interface AccountCase extends AccountCaseBase {
  id: number
  sort: number
}
