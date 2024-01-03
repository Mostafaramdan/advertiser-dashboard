import { FormModalProps } from '@/interfaces/Forms'

export interface Responsible {
  id?: number
  name: string
  email: string
  phone: string
  hide_name?: boolean
  hide_email?: boolean
  hide_phone?: boolean
  user_id?: number | null
  is_active?: boolean
}

export interface ResponsibleFormModalProps extends FormModalProps {
  userId?: number | null
}
