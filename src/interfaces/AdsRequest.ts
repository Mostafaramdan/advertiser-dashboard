type User = {
  id: number
  username: string
  email: string
  phone: string
  image_path: string
  rate: number
}

export interface AdsRequestsItem {
  id: number
  created_at: string
  price: number
  commission: number
  release_total: string
  ads_request_status: string
  payment_status: string
  payment_method: string
  user: User
  advertiser: User
}

export interface AdsRequestCoupon {
  id: number
  discount: number
  store_name: string
  image_path: string
  link: string
  code: string
  ended_at: string
  uses: number
  goes_count: number
  views_count: number
  shares_count: number
  likes_count: number
  dislikes_count: number
  description: string
  is_active: boolean
}

export interface AdsRequestAttachment {
  id: number
  type: string
  path: string
  is_vimeo?: boolean
}

export interface AdsRequestsDetails {
  id: number
  created_at: string
  advertiser: User
  user: User
  order_info: {
    ads_count: number
    ads_type: string
    ads_category: string
    repeat_count: number
    range_date: string
    ads_method: string
    description: string
    title: string
    ads_number: number
    rate: number | null
    ads_request_status: string
  }
  payment_info: {
    id: number
    created_at: string
    payment_method: string
    payment_deadline: string
    payment_status: string
    total_costs: number
    main_cost: number
    total_commission: number
    release_total: number
    prizes: number
    order_price: number
    other_costs: number
    coupon_discount: number
    special_discounts: number
    total_discounts: number
    tax: number
    confirm_transfer: string
    advertiser_points: number
    user_points: number
    marketer_points: number
    advertiser_points_value: number
    user_points_value: number
    marketer_points_value: number
    pdf: string | null
  } | null
  transfer_info_out_platforms: {
    bank_name: string
    total_transfer: number
    transferred_at: string
    transfer_image: string
  } | null
  platform_commission: {
    confirm_transfer: string
    commission_percent: number
    commission_value: number
  } | null
  order_content: {
    ads_locations: {
      show_app: boolean
      show_profile: boolean
    } | null
    channels: {
      id: number
      name: string
      image_path: string
    }[]
    attachments: AdsRequestAttachment[]
    links: {
      id: number
      name: string
      link: string
    }[]
    coupon: AdsRequestCoupon | null
    location: {
      name: string
      address: string
      lat: string
      lng: string
    } | null
    notes: string | null
    ads_plan: string | null
  }
  ads_request_logs: {
    id: number
    title: string
    description: string
    user: string
    created_at: string
    time_ago: string
  }[]
}
