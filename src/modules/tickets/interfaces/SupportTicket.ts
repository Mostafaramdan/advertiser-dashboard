import { File } from '@/interfaces/Shared'

type SupportTicketAdmin = {
  id: number
  name: string
  hours: number
}

export type SupportTicket = {
  id: number
  is_starred: boolean
  support_type: string
  category: string
  status: string
  created_at: string
  last_update: string
  rate: number | null
  user: {
    id?: number | null
    account_name: string
    role: string
  }
  primary_admin: SupportTicketAdmin
  secondary_admin: SupportTicketAdmin
}

export interface SupportTicketDetails {
  details: string
  closed_by: {
    id: number
    username: string
    role: string
  } | null
  attachments: {
    id: number
    path: string
    thumbnail: string
    name: string
  }[]
  rates: {
    rate: number
    comment: string
  }[]
}

export interface SupportTicketsStats {
  total: number
  new: number
  opened: number
  answered: number
  waiting: number
  transferred: number
  finished: number
  cancelled: number
}

export interface ConversationsListItem {
  id: number
  created_at: string
  details: string
  user: {
    id: number
    account_name: string
    image_path: string
  }
  attachments: { id: number; path: string; name: string }[]
}

export interface ConversationForm {
  details: string
  file?: File | null
  file_id: number | null
}

export interface TicketLogsItem {
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
