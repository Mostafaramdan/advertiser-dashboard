export const OFFER_STATUSES = new Map([
  ['pending', { label: 'قيد الانتظار' }],
  ['accepted', { label: 'مقبول' }],
  ['rejected', { label: 'مرفوض' }],
  ['finished', { label: 'منتهي' }],
  ['cancelled', { label: 'ملغي' }],
])

export const OFFER_TYPES = new Map([
  ['in', { label: 'داخل المنصة' }],
  ['out', { label: 'خارج المنصة' }],
])

export const PRODUCT_STATUSES = new Map([
  ['new', { label: 'جديد' }],
  ['used', { label: 'مستعمل' }],
  ['expiry', { label: 'بتاريخ صلاحية' }],
])

export const STORES_TYPES = new Map([
  ['website', { label: 'متجر إلكتروني' }],
  ['marketplace', { label: 'منفذ بيع' }],
])

export const SORT_TYPES = {
  most_view: 'الاعلي مشاهدة',
  newest: 'الأحدث',
  oldest: 'الأقدم',
  most_rated: 'الاعلي تقييما',
  most_viewed_this_week: 'الاكثر مشاهدة هذا الاسبوع',
}

export const FILTER_TYPES = {
  ended: 'العروض المنتهية',
  incoming: 'العروض القادمة',
  this_week: 'عروض الاسبوع',
}
