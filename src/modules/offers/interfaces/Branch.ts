import { FormModalProps } from '@/interfaces/Forms'
import { Location } from '@/interfaces/Shared'

export interface Branch {
  id?: number
  name: string
  user_id: number | null
  address: {
    name: string
    description: string
    location: Location
    apartment_details: {
      building_number: string
      floor_number: string
      apartment_number: string
    }
  }
}

export interface BranchFormModalProps extends FormModalProps {
  userId?: number | null
}
