<script setup lang="ts">
import { cloneItem } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import { useToast } from 'vue-toastification'
import { rolesService } from '../services/RolesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ formAction: FormActionType }>(), {
  formAction: 'view',
})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const formRef = ref<any>(null)
let employeeId: number = +route.params.id

const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<any>({
  name: '',
  is_active: true,
  permissions: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة صلاحية'
    : props.formAction === 'edit'
    ? 'تعديل صلاحية'
    : 'عرض صلاحية'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
initData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

function initData() {
  if (props.formAction === 'edit') getEmployeeData()
}

function getEmployeeData() {
  isLoading.data = true
  rolesService
    .getSingleItem(employeeId)
    .then((res) => {
      Object.assign(formData, res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToRolesPage() {
  router.push({ name: 'team-roles-page' })
}

function edit(payload: any) {
  console.log(payload)
  rolesService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToRolesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: any) {
  rolesService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToRolesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getFormData() {
  const payload = cloneItem(formData)
  return payload
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    if (errorsArr.length) {
      toast.error(errorsArr.slice(0, 2).join('\n'))
    }
    if (errorsArr.length) return

    isLoading.submit = true
    const payload = getFormData()
    props.formAction === 'create' ? create(payload) : edit(payload)
  })
}
// #endregion

const PERMISSION_LIST = ref([
  {
    title: 'صلاحيات عامة',
    groups: [
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
            key: 'view_general_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_general_settings',
          },
        ],
      },
      {
        title: 'حسابات التواصل',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_social_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_social_settings',
          },
        ],
      },
      {
        title: 'دوام المنصة',
        permissions: [
          {
            label: 'عرض',
            checked: false,
            key: 'view_schedule_settings',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_schedule_settings',
          },
        ],
      },
      {
        title: 'طرق الدفع',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_billing_cards',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_billing_card',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_billing_card',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_billing_card',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_billing_card',
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
            key: 'view_questions',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_question',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_question',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_question',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_question',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_question',
          },
        ],
      },
      {
        title: 'أقسام الأسئلة الشائعة',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_support_categories',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_support_category',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_support_category',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_support_category',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_support_category',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_support_category',
          },
        ],
      },
      {
        title: 'أسباب البلاغات',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_report_reasons',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_report_reason',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_report_reason',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_report_reason',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_report_reason',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_report_reason',
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
            key: 'view_terms',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_term',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_term',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_term',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_term',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_term',
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
            key: 'view_page_news',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_page_new',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_page_new',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_page_new',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_page_new',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_page_new',
          },
        ],
      },
      {
        title: 'شركاء النجاح',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_partners',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_partner',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_partner',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_partner',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_partner',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_partner',
          },
        ],
      },
      {
        title: 'الفيديوهات التعريفية',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_videos',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_video',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_video',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_video',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_video',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_video',
          },
        ],
      },
      {
        title: 'من نحن',
        permissions: [
          {
            label: 'عرض الكل',
            checked: false,
            key: 'view_abouts',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_about',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_about',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_about',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_about',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_about',
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
            key: 'view_admin_replies',
          },
          {
            label: 'إضافة',
            checked: false,
            key: 'create_admin_reply',
          },
          {
            label: 'تعديل',
            checked: false,
            key: 'update_admin_reply',
          },
          {
            label: 'حذف',
            checked: false,
            key: 'delete_admin_reply',
          },
          {
            label: 'تغيير الحالة',
            checked: false,
            key: 'change_status_admin_reply',
          },
          {
            label: 'ترتيب',
            checked: false,
            key: 'sort_admin_reply',
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
])

function toggleSingleGroupCheck(value: boolean, permissions: any) {
  permissions.forEach((permission: any) => (permission.checked = value))
}

function toggleMultipleGroupCheck(value: boolean, groups: any) {
  groups.forEach((group: any) => {
    toggleSingleGroupCheck(value, group.permissions)
  })
}
</script>

<template>
  <div>
    <VCard class="page-card" v-loading="isLoading.data">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn @click="goToRolesPage" />
          <div>
            {{ formTitle }}
          </div>
        </div>
      </template>
      <VCardText class="form-modal">
        <VCard flat>
          <VeeForm ref="formRef" @submit="submit">
            <div class="d-flex flex-column flex-md-row gap-4 mb-5">
              <div class="flex-grow-1">
                <AppTextField
                  v-model="formData.name"
                  label="اسم الصلاحية"
                  placeholder="اسم الصلاحية"
                  type="text"
                  name="name"
                  rules="required|min:3|max:50"
                  prepend-inner-icon="tabler-key"
                />
              </div>
              <div class="px-md-3">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </div>
            </div>

            <div class="permissions-list mt-2">
              <VExpansionPanels
                v-for="(item, index) in PERMISSION_LIST"
                :key="index"
                class="expansion-panels-width-border mb-6 permissions-list__item"
                :model-value="0"
              >
                <VExpansionPanel elevation="0">
                  <VExpansionPanelTitle>
                    <span class="permissions-list__item__title">
                      <span @click.stop="">
                        <VCheckbox
                          hide-details
                          :ripple="false"
                          @update:model-value="toggleMultipleGroupCheck($event, item.groups)"
                          :model-value="
                            item.groups.every((group) =>
                              group.permissions.every((role) => role.checked),
                            )
                          "
                        ></VCheckbox>
                      </span>
                      <strong class="text-primary">{{ item.title }}</strong>
                    </span>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <div class="d-flex flex-wrap gap-4">
                      <div
                        class="permissions-list__item__group d-flex align-md-center flex-grow-1 flex-column flex-md-row"
                        v-for="(group, index) in item.groups"
                        :key="index"
                      >
                        <div style="min-inline-size: 140px">
                          <VCheckbox
                            class="main-checkbox"
                            :model-value="group.permissions.every((role) => role.checked)"
                            :label="group.title"
                            @update:model-value="toggleSingleGroupCheck($event, group.permissions)"
                          >
                          </VCheckbox>
                        </div>
                        <div class="permissions-list__item__options">
                          <VCheckbox
                            v-model="permission.checked"
                            v-for="permission in group.permissions"
                            :key="permission.label"
                            :label="permission.label"
                          />
                        </div>
                      </div>
                    </div>
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
            </div>

            <div cols="12" v-if="formAction !== 'view'" class="d-flex flex-wrap gap-3">
              <VBtn class="px-8" variant="outlined" color="error" @click="goToRolesPage">
                {{ t('actions.back') }}
              </VBtn>
              <VBtn
                class="px-8"
                :loading="isLoading.submit"
                :disabled="isLoading.submit"
                @click="submit"
              >
                {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
              </VBtn>
            </div>
          </VeeForm>
        </VCard>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-card-item) {
  padding-block-end: 12px;
}

.permissions-list {
  :deep(.v-expansion-panels.expansion-panels-width-border[class]) {
    border-color: rgb(var(--v-theme-grey-500), 1);
  }

  :deep(.v-expansion-panel-title) {
    padding-block: 5px;
    padding-inline: 15px;
  }

  &__item {
    &__title {
      display: flex;
      align-items: center;

      > span {
        position: relative;
        margin-inline-end: 5px;
      }
    }

    &__group {
      border: 1px solid rgb(var(--v-theme-grey-500), 1);
      border-radius: 5px;
      padding-block: 0;
      padding-inline: 10px;
    }

    &__options {
      display: flex;
      flex-wrap: wrap;
      border-inline-start: 1px solid rgb(var(--v-theme-grey-500), 1);
      gap: 0 15px;
      margin-inline-start: 10px;
      padding-inline-start: 10px;

      @include responsive-down(md) {
        padding: 0;
        margin: 0;
        border-block-start: 1px solid rgb(var(--v-theme-grey-500), 1);
        border-inline-start: 0;
      }
    }

    .main-checkbox {
      :deep(.v-label) {
        color: rgba(var(--v-theme-primary), 1);
      }
    }
  }
}
</style>
