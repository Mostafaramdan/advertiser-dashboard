export interface User {
  id: number
  username: string
  role: string
}

export interface DisputeRequest {
  id: number
  is_starred: boolean
  ads_request_id: number
  disputer: User
  disputed: User
  request_type: string
  created_at: string
  updated_at: string
  can_make_procedure: boolean
  dispute_status: string
}

export interface DisputeRequestProcedureForm {
  procedure_id: null | number
  details: string
}
