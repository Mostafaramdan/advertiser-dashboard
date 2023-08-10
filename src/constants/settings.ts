export const CATEGORY_TYPES = {
  ads: 'اقسام الاعلانات',
  coupons: 'اقسام المتاجر',
}

export const CATEGORY_TYPES_OPTIONS = Object.entries(CATEGORY_TYPES).map(([key, value]) => ({ value: key, label: value }))
