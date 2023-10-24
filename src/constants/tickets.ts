export const USERS_TYPES: any = {
  user: 'تاجر',
  advertiser: 'معلن',
  guest: 'غير مسجل',
}

export const TICKETS_STATUSES = new Map([
  ['new', { label: 'جديدة' }],
  ['opened', { label: 'مفتوحة' }],
  ['answered', { label: 'مجابة' }],
  ['waiting', { label: 'مؤجلة' }],
  ['transferred', { label: 'محولة' }],
  ['cancelled', { label: 'مقفلة' }],
  ['finished', { label: 'منتهية' }],
])

export const FAVORITE_STATUSES = {
  1: 'مفضل',
  0: 'غير مفضل',
}
