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
  ['متجر إلكتروني', { label: 'منفذ بيع' }],
])
