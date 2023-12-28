export const REPEAT_TYPES = {
  day: 'يوم',
  week: 'اسبوع',
  month: 'شهر',
  year: 'سنة',
}

export const ADS_SPACE_REQUEST_STATUSES = new Map([
  ['pending', { label: 'قيد الانتظار' }],
  ['accepted', { label: 'مقبول' }],
  ['cancelled', { label: 'ملغي' }],
  ['rejected', { label: 'مرفوض' }],
  ['completed', { label: 'مكتمل' }],
  ['partially_completed', { label: 'مكتمل جزئيا' }],
])
