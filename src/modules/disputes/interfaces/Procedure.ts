export interface ProcedureBase {
  name: string
  status: string | null
  is_active: boolean
}

export interface Procedure extends ProcedureBase {
  id: number
  sort: number
}
