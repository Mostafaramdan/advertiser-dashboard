import { PermissionListItem } from '@/modules/team/interfaces/Role'

export const EMPLOYEES_TYPES: any = {
  in: 'داخلي',
  out: 'خارجي',
}

export const STATUSES_TYPES = {
  1: 'مفعل',
  0: 'غير مفعل',
}

export const SORT_TYPES = {
  latest: 'الأحدث',
  oldest: 'الأقدم',
}

export const PERMISSIONS_LIST: PermissionListItem[] = [
  {
    title: 'صلاحيات عامة',
    groups: [
      {
        title: 'الاشعارات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_notifications',
          },
          {
            label: 'إرسال',
            checked: false,
            key: 'create_notification',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_notification',
          },
        ],
      },
      {
        title: 'التنيهات',
        permissions: [
          {
            label: 'إرسال تنبية',
            checked: false,
            key: 'notify_users',
          },
        ],
      },
      {
        title: 'صلاحيات مشتركة للمستخدمين',
        permissions: [
          {
            label: 'عرض سجل حظر المحادثات',
            checked: false,
            key: 'show_chat_blocks',
          },
          {
            label: 'عرض التراخيص',
            checked: false,
            key: 'show_attachments',
          },
          {
            label: 'عرض سجل التراخيص',
            checked: false,
            key: 'show_attachments_logs',
          },
          {
            label: 'إرسال تنبية للتراخيص',
            checked: false,
            key: 'send_notification_attachments',
          },
          {
            label: 'اضافة  ملاحظة للتراخيص',
            checked: false,
            key: 'send_note_attachments',
          },
          {
            label: 'الموافقة علي التراخيص',
            checked: false,
            key: 'confirm_attachments',
          },
        ],
      },
    ],
  },
  {
    title: 'إعدادت حساب المنصة',
    groups: [
      {
        title: 'بيانات المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'betrend_view_general_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_general_settings',
          },
        ],
      },
      {
        title: 'حسابات التواصل',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'betrend_view_social_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_social_settings',
          },
        ],
      },
      {
        title: 'دوام المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'betrend_view_schedule_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_schedule_settings',
          },
        ],
      },
      {
        title: 'طرق الدفع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_billing_cards',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_billing_card',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_billing_card',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_billing_card',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_billing_card',
          },
        ],
      },
    ],
  },
  {
    title: 'الإعدادات المالية',
    groups: [
      {
        title: 'الحسابات',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_financial_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_financial_settings',
          },
        ],
      },
      {
        title: 'شرائح عمولة الدفع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_payment_commissions',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_payment_commission',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_payment_commission',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_payment_commission',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_payment_commission',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_payment_commission',
          },
        ],
      },
      {
        title: 'النقاط',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_point_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_point_settings',
          },
        ],
      },
      {
        title: 'الضريبة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_tax_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_tax_settings',
          },
        ],
      },
    ],
  },
  {
    title: 'إعدادات حسابات المعلنين',
    groups: [
      {
        title: 'أنواع الاعلانات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ads_types',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_ads_type',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ads_type',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ads_type',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ads_type',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_ads_type',
          },
        ],
      },
      {
        title: 'انواع تمييز الحسابات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_discrimination_types',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_discrimination_type',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_discrimination_type',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_discrimination_type',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_discrimination_type',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_discrimination_type',
          },
        ],
      },
      {
        title: 'حالات الحسابات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_account_cases',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_account_case',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_account_case',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_account_case',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_account_case',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_account_case',
          },
        ],
      },
      {
        title: 'إعدادات الاشتراك',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_subscription_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_subscription_setting',
          },
        ],
      },
    ],
  },
  {
    title: 'الإعدادت العامة',
    groups: [
      {
        title: 'الدول',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_countries',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_country',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_country',
          },
        ],
      },
      {
        title: 'المناظق',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_areas',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_area',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_area',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_area',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_area',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_area',
          },
        ],
      },
      {
        title: 'الكيانات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_entities',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_entity',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_entity',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_entity',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_entity',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_entity',
          },
        ],
      },
      {
        title: 'التصنيفات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_tags',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_tag',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_tag',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_tag',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_tag',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_tag',
          },
        ],
      },
      {
        title: 'الاقسام',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_category',
          },
        ],
      },
      {
        title: 'القنوات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_channels',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_channel',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_channel',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_channel',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_channel',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_channel',
          },
        ],
      },
      {
        title: 'اعدادات التشغيل',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_ads_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ads_settings',
          },
        ],
      },
      {
        title: 'الاسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_questions',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_question',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_question',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_question',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_question',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_question',
          },
        ],
      },
      {
        title: 'أقسام الأسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_support_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_support_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_support_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_support_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_support_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_support_category',
          },
        ],
      },
      {
        title: 'أسباب البلاغات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_report_reasons',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_report_reason',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_report_reason',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_report_reason',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_report_reason',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_report_reason',
          },
        ],
      },
      {
        title: 'عناصر التقييم',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_rate_types',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_rate_type',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_rate_type',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_rate_type',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_rate_type',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_rate_type',
          },
        ],
      },
      {
        title: 'الشروط والاحكام',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_terms',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_term',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_term',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_term',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_term',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_term',
          },
        ],
      },
      {
        title: 'بنود إضافية للباقات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_subscription_extra_points',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_subscription_extra_point',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_subscription_extra_point',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_subscription_extra_point',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_subscription_extra_point',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_subscription_extra_point',
          },
        ],
      },
      {
        title: 'جديد المنصة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_page_news',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_page_new',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_page_new',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_page_new',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_page_new',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_page_new',
          },
        ],
      },
      {
        title: 'شركاء النجاح',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_partners',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_partner',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_partner',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_partner',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_partner',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_partner',
          },
        ],
      },
      {
        title: 'الفيديوهات التعريفية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_videos',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_video',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_video',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_video',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_video',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_video',
          },
        ],
      },
      {
        title: 'من نحن',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_abouts',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_about',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_about',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_about',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_about',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_about',
          },
        ],
      },
      {
        title: 'إعدادات التذاكر',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_ticket_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ticket_settings',
          },
        ],
      },
      {
        title: 'إعدادات الشات',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_chat_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_chat_settings',
          },
        ],
      },
      {
        title: 'الردود الجاهزة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'betrend_view_admin_replies',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'betrend_create_admin_reply',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'betrend_update_admin_reply',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'betrend_delete_admin_reply',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'betrend_change_status_admin_reply',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'betrend_sort_admin_reply',
          },
        ],
      },
      {
        title: 'شرائح الميزانية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_budget_slides',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_budget_slides',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_budget_slides',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_budget_slides',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_budget_slides',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_budget_slides',
          },
        ],
      },
    ],
  },
  {
    title: 'العروض',
    groups: [
      {
        title: 'الوحدات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_units',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_unit',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_unit',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_unit',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_unit',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_unit',
          },
        ],
      },
      {
        title: 'مهل دفع العرض',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_offer_deadlines',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_offer_deadline',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_offer_deadline',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_offer_deadline',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_offer_deadline',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_offer_deadline',
          },
        ],
      },
      {
        title: 'طرق دفع العرض',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_offer_payment_methods',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_offer_payment_method',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_offer_payment_method',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_offer_payment_method',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_offer_payment_method',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_offer_payment_method',
          },
        ],
      },
      {
        title: 'البنرات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_banners',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_banner',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_banner',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_banner',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_banner',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_banner',
          },
        ],
      },
      {
        title: 'العروض',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_offers',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_offer',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_offer',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_offer',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_offer',
          },
          {
            label: 'تعديل حالة العرض',
            checked: false,
            key: 'update_offer_status',
          },
          {
            label: 'عرض صلاحيات التعديل',
            checked: false,
            key: 'view_offer_permissions',
          },
          {
            label: 'تعديل صلاحيات التعديل',
            checked: false,
            key: 'update_offer_permissions',
          },
          {
            label: 'إعادة نشر',
            checked: false,
            key: 'repost_offer',
          },
          {
            label: 'عرض الاحصائيات',
            checked: false,
            key: 'view_offer_statistics',
          },
          {
            label: 'عرض سجل العمليات',
            checked: false,
            key: 'view_offer_logs',
          },
        ],
      },
      {
        title: 'اعدادات تشغيل العروض',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_offer_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_offer_settings',
          },
        ],
      },
      {
        title: 'المنتجات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_products',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_product',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_product',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_product',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_product',
          },
          {
            label: 'الموافقة علي المنتج',
            checked: false,
            key: 'accept_product',
          },
          {
            label: 'نشر',
            checked: false,
            key: 'post_product',
          },
          {
            label: 'تعديل حالة الكمية',
            checked: false,
            key: 'toggle_product_availability_quantity',
          },
          {
            label: 'عرض سجل التوصيات',
            checked: false,
            key: 'view_product_notes',
          },
          {
            label: 'عرض جميع التوصيات',
            checked: false,
            key: 'view_all_product_notes',
          },
          {
            label: 'إضافة توصية',
            checked: false,
            key: 'create_product_note',
          },
          {
            label: 'تعديل توصية',
            checked: false,
            key: 'update_product_note',
          },
          {
            label: 'حذف توصية',
            checked: false,
            key: 'delete_product_note',
          },
          {
            label: 'عرض صلاحيات التعديل',
            checked: false,
            key: 'view_product_permissions',
          },
          {
            label: 'تعديل صلاحيات التعديل',
            checked: false,
            key: 'update_product_permissions',
          },
        ],
      },
      {
        title: 'طلبات التنبية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_remind_requests',
          },
        ],
      },
      {
        title: 'جديد المنصة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_page_news',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_page_new',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_page_new',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_page_new',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_page_new',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_page_new',
          },
        ],
      },
      {
        title: 'الشروط والاحكام',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_terms',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_term',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_term',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_term',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_term',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_term',
          },
        ],
      },
      {
        title: 'شركاء النجاح',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_partners',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_partner',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_partner',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_partner',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_partner',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_partner',
          },
        ],
      },
      {
        title: 'من نحن',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_abouts',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_about',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_about',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_about',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_about',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_about',
          },
        ],
      },
      {
        title: 'الفيديوهات التعريفية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_videos',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_video',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_video',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_video',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_video',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_video',
          },
        ],
      },
      {
        title: 'الاسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_questions',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_question',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_question',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_question',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_question',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_question',
          },
        ],
      },
      {
        title: 'أقسام الأسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_support_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_support_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_support_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_support_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_support_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_support_category',
          },
        ],
      },
      {
        title: 'أسباب البلاغات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_report_reasons',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_report_reason',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_report_reason',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_report_reason',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_report_reason',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_report_reason',
          },
        ],
      },
      {
        title: 'الردود الجاهزة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_admin_replies',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_admin_reply',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_admin_reply',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_admin_reply',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_admin_reply',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'offers_sort_admin_reply',
          },
        ],
      },
    ],
  },
  {
    title: 'إعدادت حساب المنصة العروض',
    groups: [
      {
        title: 'بيانات المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'offers_view_general_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_general_settings',
          },
        ],
      },
      {
        title: 'حسابات التواصل',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'offers_view_social_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_social_settings',
          },
        ],
      },
      {
        title: 'دوام المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'offers_view_schedule_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_schedule_settings',
          },
        ],
      },
      {
        title: 'طرق الدفع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'offers_view_billing_cards',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'offers_create_billing_card',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'offers_update_billing_card',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'offers_delete_billing_card',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'offers_change_status_billing_card',
          },
        ],
      },
    ],
  },
  {
    title: 'المساحات',
    groups: [
      {
        title: 'المسافات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_distances',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_distance',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_distance',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_distance',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_distance',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_distance',
          },
        ],
      },
      {
        title: 'أسعار المشاهدات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_views_prices',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_views_price',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_views_price',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_views_price',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_views_price',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_views_price',
          },
        ],
      },
      {
        title: 'المساحات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ad_spaces',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_ad_space_details',
          },
          {
            label: 'عرض الإحصائيات',
            checked: false,
            key: 'view_ad_space_statistics',
          },
          {
            label: 'عرض الطلبات',
            checked: false,
            key: 'view_ad_space_requests',
          },
          {
            label: 'عرض سجل طلب',
            checked: false,
            key: 'view_space_requests_logs',
          },
          {
            label: 'عرض المشاركات',
            checked: false,
            key: 'view_space_shares',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ad_space',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ad_space',
          },
          {
            label: 'إضافة رصيد',
            checked: false,
            key: 'add_balance_to_ad_space',
          },
        ],
      },
      {
        title: 'اعدادات المساحات',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_ad_space_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ad_space_settings',
          },
        ],
      },
      {
        title: 'جديد المنصة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_page_news',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_page_new',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_page_new',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_page_new',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_page_new',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_page_new',
          },
        ],
      },
      {
        title: 'الشروط والاحكام',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_terms',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_term',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_term',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_term',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_term',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_term',
          },
        ],
      },
      {
        title: 'شركاء النجاح',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_partners',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_partner',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_partner',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_partner',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_partner',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_partner',
          },
        ],
      },
      {
        title: 'من نحن',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_abouts',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_about',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_about',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_about',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_about',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_about',
          },
        ],
      },
      {
        title: 'الفيديوهات التعريفية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_videos',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_video',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_video',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_video',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_video',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_video',
          },
        ],
      },
      {
        title: 'الاسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_questions',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_question',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_question',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_question',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_question',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_question',
          },
        ],
      },
      {
        title: 'أقسام الأسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_support_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_support_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_support_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_support_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_support_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_support_category',
          },
        ],
      },
      {
        title: 'أسباب البلاغات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_report_reasons',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_report_reason',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_report_reason',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_report_reason',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_report_reason',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_report_reason',
          },
        ],
      },
      {
        title: 'الردود الجاهزة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_admin_replies',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_admin_reply',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_admin_reply',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_admin_reply',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_admin_reply',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'ad_spaces_sort_admin_reply',
          },
        ],
      },
    ],
  },
  {
    title: 'إعدادت حساب المنصة المساحات',
    groups: [
      {
        title: 'بيانات المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'ad_spaces_view_general_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_general_settings',
          },
        ],
      },
      {
        title: 'حسابات التواصل',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'ad_spaces_view_social_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_social_settings',
          },
        ],
      },
      {
        title: 'دوام المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'ad_spaces_view_schedule_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_schedule_settings',
          },
        ],
      },
      {
        title: 'طرق الدفع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'ad_spaces_view_billing_cards',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'ad_spaces_create_billing_card',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'ad_spaces_update_billing_card',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'ad_spaces_delete_billing_card',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'ad_spaces_change_status_billing_card',
          },
        ],
      },
    ],
  },
  {
    title: 'الإشتراكات',
    groups: [
      {
        title: 'باقات الإشتراك',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_packages',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'show_package_details',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_package',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_package',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_package',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_package',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_package',
          },
        ],
      },
      {
        title: 'طلبات الاشتراكات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_subscription_requests',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_subscription_request',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_subscription_request',
          },
          {
            label: 'قبول',
            checked: false,
            key: 'accept_subscription_request',
          },
          {
            label: 'رفض',
            checked: false,
            key: 'reject_subscription_request',
          },
          {
            label: 'منح فترة مجانية',
            checked: false,
            key: 'active_temp_subscription_request',
          },
          {
            label: 'تنشيط مرة واحدة',
            checked: false,
            key: 'active_once_subscription_request',
          },
          {
            label: 'موقوف مؤقتا',
            checked: false,
            key: 'stop_temp_subscription_request',
          },
          {
            label: 'عمل أجازة',
            checked: false,
            key: 'vacation_subscription_request',
          },
          {
            label: 'تجديد الاشتراك',
            checked: false,
            key: 'renew_subscription_request',
          },
          {
            label: 'تمديد الإشتراك',
            checked: false,
            key: 'extend_subscription_request',
          },
          {
            label: 'ترقية',
            checked: false,
            key: 'promote_subscription_request',
          },
        ],
      },
      {
        title: 'سجل الاشتراكات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_subscription_requests_logs',
          },
        ],
      },
      {
        title: 'المعلنين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_advertisers',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_advertiser_details',
          },
          {
            label: 'عرض إحصائات الحساب',
            checked: false,
            key: 'show_advertiser_statistics',
          },
          {
            label: 'عرض سجل طلبات الاعلانات',
            checked: false,
            key: 'show_advertiser_ads_request_logs',
          },
          {
            label: 'عرض إعدادات الحساب',
            checked: false,
            key: 'show_account_settings',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_advertiser',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_advertiser',
          },
          {
            label: 'اتخاذ اجراء',
            checked: false,
            key: 'take_procedure',
          },
          {
            label: 'عرض العرض التسويقي',
            checked: false,
            key: 'show_marketer_info',
          },
          {
            label: 'تعديل العرض التسويقي',
            checked: false,
            key: 'convert_to_marketer',
          },
        ],
      },
    ],
  },
  {
    title: 'المستخدمين',
    groups: [
      {
        title: 'المستخدمين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_users',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_user_details',
          },
          {
            label: 'عرض سجل طلبات الاعلانات',
            checked: false,
            key: 'show_user_ads_request_logs',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_user',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_user',
          },
        ],
      },
      {
        title: 'الموظفين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_admins',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_admin_details',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_admin',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_admin',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_admin',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_admin',
          },
        ],
      },
      {
        title: 'الصلاحيات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_roles',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_role_details',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_role',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_role',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_role',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_role',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_role',
          },
        ],
      },
      {
        title: 'أقسام فريق العمل',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_role_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_role_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_role_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_role_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_role_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_role_category',
          },
        ],
      },
    ],
  },
  {
    title: 'المحافظ والدفع الإلكتروني',
    groups: [
      {
        title: 'سجل العمليات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_payment_logs',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_payment_log_details',
          },
        ],
      },
      {
        title: 'محافظ المستخدمين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_users_wallet',
          },
        ],
      },
      {
        title: 'سجل الصرف',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_withdraw_requests',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_withdraw_request_details',
          },
          {
            label: 'انشاء سحب',
            checked: false,
            key: 'create_withdraw_request',
          },
          {
            label: 'ارسال تنبيه',
            checked: false,
            key: 'notify_withdraw_request',
          },
        ],
      },
    ],
  },
  {
    title: 'النقاط والمكافآت',
    groups: [
      {
        title: 'سجل النقاط',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_points_logs',
          },
        ],
      },
      {
        title: 'نقاط المستخدمين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_users_points',
          },
        ],
      },
    ],
  },
  {
    title: 'الكوبونات',
    groups: [
      {
        title: 'كوبونات المنصة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_platform_coupons',
          },
          {
            label: 'سجل المشتركين',
            checked: false,
            key: 'view_coupon_subscriber_logs',
          },
          {
            label: 'سجل العمليات',
            checked: false,
            key: 'view_coupon_transactions_history',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_platform_coupon',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_platform_coupon',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_platform_coupon',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_platform_coupon',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_platform_coupon',
          },
        ],
      },
      {
        title: 'كوبونات المعلنين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_advertiser_coupons',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_advertiser_coupon',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_advertiser_coupon',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_advertiser_coupon',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_advertiser_coupon',
          },
        ],
      },
      {
        title: 'كوبونات التجار',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ads_request_coupons',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ads_request_coupon',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ads_request_coupon',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ads_request_coupon',
          },
        ],
      },
      {
        title: 'المتاجر',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_stores',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_store',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_store',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_store',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_store',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_store',
          },
          {
            label: 'الاعتماد من المنصة',
            checked: false,
            key: 'change_confirm_status_store',
          },
        ],
      },
    ],
  },
  {
    title: 'التذاكر',
    groups: [
      {
        title: 'أنواع التذاكر',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ticket_types',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_ticket_type',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ticket_type',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ticket_type',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ticket_type',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_support_ticket_type',
          },
        ],
      },
      {
        title: 'أقسام التذاكر',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ticket_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_ticket_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_ticket_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ticket_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ticket_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_ticket_category',
          },
        ],
      },
      {
        title: 'تذاكر الدعم',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_tickets',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_ticket_details',
          },
          {
            label: 'عرض ملخص العمليات',
            checked: false,
            key: 'view_ticket_logs',
          },
          {
            label: 'عرض المحادثات',
            checked: false,
            key: 'view_ticket_conversations',
          },
          {
            label: 'الرد غلي المحادثة',
            checked: false,
            key: 'reply_ticket',
          },
          {
            label: 'تعديل الحالة',
            checked: false,
            key: 'change_ticket_status',
          },
          {
            label: 'تغيير المسؤل',
            checked: false,
            key: 'assign_ticket',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ticket',
          },
        ],
      },
    ],
  },
  {
    title: 'الاعلانات و طلبات الاعلانات',
    groups: [
      {
        title: 'الاعلانات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ads',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_ads_details',
          },
          {
            label: 'عرض التعليقات',
            checked: false,
            key: 'view_ads_comments',
          },
          {
            label: 'حذف تعليق',
            checked: false,
            key: 'delete_comment',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ads',
          },
          {
            label: 'استرجاع',
            checked: false,
            key: 'restore_ads',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_ads',
          },
        ],
      },
      {
        title: 'الطلبات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ads_requests',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_ads_requests_details',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ads_request',
          },
        ],
      },
      {
        title: 'أنواع التنازع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_dispute_types',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_dispute_type',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_dispute_type',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_dispute_type',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_dispute_type',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_dispute_type',
          },
        ],
      },
      {
        title: 'إجراءات التنازع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_dispute_procedures',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_dispute_procedure',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_dispute_procedure',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_dispute_procedure',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_dispute_procedure',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_dispute_procedure',
          },
        ],
      },
      {
        title: 'طلبات التنازع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_disputes',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_dispute_details',
          },
          {
            label: 'عرض ملخص العمليات',
            checked: false,
            key: 'view_dispute_logs',
          },
          {
            label: 'عرض تفاصيل أخرى',
            checked: false,
            key: 'view_dispute_other_details',
          },
          {
            label: 'عرض المحادثات',
            checked: false,
            key: 'view_dispute_conversations',
          },
          {
            label: 'الرد غلي المحادثة',
            checked: false,
            key: 'reply_dispute_request',
          },
          {
            label: 'اتخاذ اجراء',
            checked: false,
            key: 'make_procedure_dispute',
          },
        ],
      },
    ],
  },
  {
    title: 'البلاغات',
    groups: [
      {
        title: 'بلاغات الاعلانات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_ads_reports',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_ads_reports_details',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_ad_report',
          },
        ],
      },
      {
        title: 'بلاغات المعلنين',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_advertiser_reports',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_advertiser_report_details',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_advertiser_report',
          },
        ],
      },
      {
        title: 'بلاغات الشات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_chat_reports',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_chat_report',
          },
        ],
      },
      {
        title: 'تقييم الشات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_chat_rates',
          },
        ],
      },
      {
        title: 'حظر عرض الاعلانات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_advertiser_blocks',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_advertiser_block_details',
          },
        ],
      },
      {
        title: 'حظر المحادثات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_chat_blocks',
          },
          {
            label: 'عرض التفاصيل',
            checked: false,
            key: 'view_chat_block_details',
          },
        ],
      },
    ],
  },
]
