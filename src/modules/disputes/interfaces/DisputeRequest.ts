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
  request_status: string
  payment_status: string
  ads_request_total: number
  retake_money: number
  accepted_money: number
}

export interface DisputeRequestProcedureForm {
  procedure_id: null | number
  details: string
}

export interface RequestsStats {
  total: number
  new: number
  opened: number
  accepted: number
  confirmed: number
  finished: number
}

export interface DisputeRequestDetails {
  id: number
  description: string
  can_rate: boolean
  attachments: {
    id: number
    path: string
    thumbnail: string
    name: string
  }[]
  disputer_rate: {
    rate: number
    comment: string
  } | null
  disputed_rate: {
    rate: number
    comment: string
  } | null
  finished_action: {
    id: number
    user: {
      id: number
      username: string
      role: string
    }
    details: string
  }
  procedures: {
    id: number
    details: string
    created_at: string
  }[]
}
