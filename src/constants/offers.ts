export const OFFER_STATUSES = new Map([
  ['pending', { label: 'قيد المعالجة' }],
  ['processing', { label: 'قيد الدراسة' }],
  ['accepted', { label: 'تم الدراسة' }],
  ['rejected', { label: 'مرفوض' }],
  ['finished', { label: 'منتهي' }],
  ['cancelled', { label: 'ملغي' }],
])

export const OFFER_TYPES = new Map([
  ['in_platform', { label: 'داخل المنصة' }],
  ['out_platform', { label: 'خارج المنصة' }],
])

export const PRODUCT_CONDITIONS = new Map([
  ['new_product', { label: 'جديد' }],
  ['used_product', { label: 'مستعمل' }],
  ['expires_soon', { label: 'بتاريخ صلاحية' }],
])

export const PRODUCT_STATUSES = new Map([
  ['pending', { label: 'في انتظار اتخاذ اجراء' }],
  ['accepted', { label: 'مقبول' }],
  ['rejected', { label: 'مرفوض' }],
  ['posted', { label: 'منشور' }],
])

export const PRODUCT_WEIGHT_UNITS = new Map([
  ['g', { label: 'غرام' }],
  ['kg', { label: 'كيلو غرام' }],
  ['lb', { label: 'رطل' }],
])

export const PRODUCT_WARRANTY_DURATION_TYPES = new Map([
  ['day', { label: 'يوم' }],
  ['week', { label: 'اسبوع' }],
  ['month', { label: 'شهر' }],
  ['year', { label: 'سنة' }],
])

export const PRODUCT_PRICING_TYPES = new Map([
  ['fixed', { label: 'ثابت' }],
  ['segments', { label: 'حسب الكمية' }],
])

export const STORES_TYPES = new Map([
  ['website', { label: 'متجر إلكتروني' }],
  ['marketplace', { label: 'منفذ بيع' }],
])

export const REMINDER_REQUEST_TYPES = new Map([
  ['start_reminder', { label: 'طلب تذكير بالبدء' }],
  ['availability_reminder', { label: 'طلب تذكير بإتاحة الكمية' }],
])

export const REMINDER_REQUESTS_SORT_TYPES = {
  min_quantity: 'الطلب الأقل كمية',
  max_quantity: 'الطلب الاكثر كمية',
  latest: 'الأحدث',
  oldest: 'الأقدم',
}

export const OFFER_DATE_TYPES = {
  fixed: 'محدد',
  dynamic: 'مرن',
}

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

export const BANNER_LINK_TYPES = {
  none: 'بدون رابط',
  internal: 'رابط داخلي',
  external: 'رابط خارجي',
}

export const BANNER_LINKABLE_TYPES = {
  offers: 'عروض',
  users: 'معلنين',
}

// offer payment methods
export const OFFER_PAYMENT_METHODS = {
  in_advance_direct_to_merchant: 'مقدما إلى حساب التاجر مباشرة',
  on_delivery: 'دفع عند الإستلام',
  in_advance_by_platform: 'مقدما عن طريق المنصة',
}

// offer deadlines
export const OFFER_DEADLINES_TIMES = {
  request: 'الطلب',
  request_approval: 'الموافقة على الطلب',
  pricing_approval: 'الموافقة على التسعير',
  receiving: 'الإستلام',
}
