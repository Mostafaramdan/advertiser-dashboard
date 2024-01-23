export const FILES_TYPES = {
  image: 'image',
  video: 'video',
  audio: 'audio',
  pdf: 'pdf',
  text: 'text',
  word: 'word',
  excel: 'excel',
  zip: 'zip',
  other: 'other',
}

export const GENDER_TYPES = {
  male: 'ذكر',
  female: 'أنثى',
}

export const NOTIFICATIONS_TYPES = [
  {
    value: 'notification',
    icon: 'tabler-bell',
  },
  {
    value: 'email',
    icon: 'tabler-mail',
  },
  {
    value: 'whatsapp',
    icon: 'tabler-brand-whatsapp',
  },
  {
    value: 'sms',
    icon: 'tabler-message',
  },
]

export const USERS_TYPES: any = {
  company: 'كيان',
  client: 'عميل',
}

export const USERS_ROLES: any = {
  user: 'تاجر',
  advertiser: 'معلن',
}

export const DAYS = {
  0: 'الأحد',
  1: 'الاثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
}

export const MAIN_APPS = new Map([
  ['be-trend', { label: 'بي ترند' }],
  ['offers', { label: 'العروض' }],
  ['ad-spaces', { label: 'المساحات' }],
])
