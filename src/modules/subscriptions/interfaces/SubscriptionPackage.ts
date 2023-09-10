import { FormActionType } from '@/interfaces/Forms'
import { File } from '@/interfaces/Shared'

export interface SubscriptionPackageFormProps {
  formAction?: FormActionType
}

export interface SubscriptionPackagePeriod {
  months_count: number
  price: number | null
  price_after_discount: number | null
  free_days: number | null
  stop_temp_days: number | null
  is_active: boolean
}

export interface SubscriptionPackageFeature {
  key: string
  value: number | null
  is_visible: boolean
  checked: boolean
  has_input: boolean
  name: string | null
  label: string | null
  min_value: number | null
  max_value: number | null
}

export interface SubscriptionPackageFeatureGroup {
  key: string
  name: string
  color: string
  items: SubscriptionPackageFeature[]
}

export interface SubscriptionPackageFormProps {
  id?: number
  image_id: number | null
  image: File | null
  name: { en: string; ar: string }
  periods: SubscriptionPackagePeriod[]
  features?: SubscriptionPackageFeatureGroup[]
  extra_settings?: SubscriptionPackageFeature[]
  subscription_settings?: SubscriptionPackageFeature[]
  advertiser_settings?: SubscriptionPackageFeature[]
}
