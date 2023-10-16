import { AdsRequestPaymentInfo, AdsRequestPlatformCommission } from '@/interfaces/AdsRequest'
import { File } from '@/interfaces/Shared'

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

export interface DisputeRequestLogsItem {
  id: number
  action: string
  username: string
  created_at: string
  attachments: {
    id: number
    name: string
    path: string
  }[]
}

export interface ConversationsListItem {
  id: number
  created_at: string
  details: string
  user: {
    id: number
    username: string
    image_path: string
  }
  attachment: File
  target_user: {
    id: number
    username: string
  }
}

export interface ConversationForm {
  details: string
  file?: File | null
  file_id: number | null
  for_user_id: number | null
}

export type UserStats = {
  type: string
  rate: string | number
  registered_at: string
  sells_total: number
  payment_total: number
  finished_requests: number
  not_finished_requests: number
  cancelled_requests: number
  dispute_requests_count: number
  dispute_requests_from_him: number
  dispute_requests_to_him: number
  dispute_requests_inprogress: number
  dispute_requests_cancelled: number
  dispute_requests_in_app: number
  dispute_requests_out_app: number
}

export interface DisputeRequestOtherInfo {
  payment_info: AdsRequestPaymentInfo
  platform_commission: AdsRequestPlatformCommission
  disputer: UserStats
  disputed: UserStats
  ads_request: {
    id: number
    created_at: string
    ads_type: string
    category: string
    area: string
  }
}
