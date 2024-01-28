<script lang="ts" setup>
import NotificationsMenu from '@/components/dashboard-notifications/NotificationsMenu.vue'
import MainAppsDropdown from '@/layouts/components/MainAppsDropdown.vue'
import NavBarI18n from '@/layouts/components/NavBarI18n.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import AppLoader from './components/AppLoader.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

// Components
// import Footer from '@/layouts/components/Footer.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
// const AppLoader = defineAsyncComponent(() => import('./components/AppLoader.vue'))
const { width: windowWidth } = useWindowSize()
const { switchToVerticalNavOnLtOverlayNavBreakpoint, isLessThanOverlayNavBreakpoint } =
  useThemeConfig()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
const { layoutAttrs, injectSkinClasses } = useSkins()
const authStore = useAuthStore()
const { getPermissions } = authStore
const isLoading = ref<boolean>(false)

const { hasAtLeaseOnePermission, hasPermission } = useAuthStore()

// #endregion

/***************************************
 **** Section Computed Declaration ****
 **************************************/
// #region Computed
const isBeTrendApp = computed(() => authStore.selectedApp === 'betrend')
const isOffersApp = computed(() => authStore.selectedApp === 'offers')
const isAdSpacesApp = computed(() => authStore.selectedApp === 'ad_spaces')
const navItems = computed(() => {
  return [
    {
      title: 'الرئيسية',
      to: { name: 'home-page' },
      icon: { icon: 'tabler-smart-home' },
      show: true,
    },
    {
      title: 'الاعدادات',
      icon: { icon: 'tabler-settings' },
      show: true,
      to: null,
      children: [
        {
          title: 'إعدادت حساب المنصة',
          show:
            hasAtLeaseOnePermission([
              'betrend_view_general_settings',
              'betrend_view_social_settings',
              'betrend_view_schedule_settings',
              'betrend_view_billing_cards',
            ]) && isBeTrendApp.value,
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'platform-settings-details' },
              show: hasPermission('betrend_view_general_settings'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'social-accounts-settings' },
              show: hasPermission('betrend_view_social_settings'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'work-time-settings' },
              show: hasPermission('betrend_view_schedule_settings'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'payment-methods-settings' },
              show: hasPermission('betrend_view_billing_cards'),
            },
          ],
        },
        {
          title: 'إعدادت حساب المنصة',
          show:
            hasAtLeaseOnePermission([
              'offers_view_general_settings',
              'offers_view_social_settings',
              'offers_view_schedule_settings',
              'offers_view_billing_cards',
            ]) && isOffersApp.value,
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'offers-platform-settings-details' },
              show: hasPermission('offers_view_general_settings'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'offers-social-accounts-settings' },
              show: hasPermission('offers_view_social_settings'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'offers-work-time-settings' },
              show: hasPermission('offers_view_schedule_settings'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'offers-payment-methods-settings' },
              show: hasPermission('offers_view_billing_cards'),
            },
          ],
        },
        {
          title: 'إعدادت حساب المنصة',
          show:
            hasAtLeaseOnePermission([
              'ad_spaces_view_general_settings',
              'ad_spaces_view_social_settings',
              'ad_spaces_view_schedule_settings',
              'ad_spaces_view_billing_cards',
            ]) && isAdSpacesApp.value,
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'ad-spaces-platform-settings-details' },
              show: hasPermission('ad_spaces_view_general_settings'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'ad-spaces-social-accounts-settings' },
              show: hasPermission('ad_spaces_view_social_settings'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'ad-spaces-work-time-settings' },
              show: hasPermission('ad_spaces_view_schedule_settings'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'ad-spaces-payment-methods-settings' },
              show: hasPermission('ad_spaces_view_billing_cards'),
            },
          ],
        },
        {
          title: 'الدول',
          to: { name: 'countries-settings' },
          show: hasPermission('view_countries'),
        },
        {
          title: 'الكيانات',
          to: { name: 'entities-settings' },
          show: hasPermission('view_entities'),
        },
        {
          title: 'التصنيفات',
          to: { name: 'tags-settings' },
          show: hasPermission('view_tags'),
        },
        {
          title: 'الاقسام',
          to: { name: 'categories-settings' },
          show: hasPermission('view_categories'),
        },
        {
          title: 'القنوات',
          to: { name: 'channels-settings' },
          show: hasPermission('view_channels'),
        },
        {
          title: 'اعدادات التشغيل',
          to: { name: 'ads-settings' },
          show: hasPermission('view_ads_settings'),
        },
        {
          title: 'الإعدادات المالية',
          show: hasAtLeaseOnePermission([
            'view_financial_settings',
            'view_payment_commissions',
            'view_point_settings',
            'view_tax_settings',
          ]),
          to: null,
          children: [
            {
              title: 'اعدادت الحسابات',
              to: { name: 'accounts-settings' },
              show: hasPermission('view_financial_settings'),
            },
            {
              title: 'شرائح عمولة الدفع',
              to: { name: 'payment-commission-settings' },
              show: hasPermission('view_payment_commissions'),
            },
            {
              title: 'اعدادت النقاط',
              to: { name: 'points-settings' },
              show: hasPermission('view_point_settings'),
            },
            {
              title: 'اعدادت الضريبة',
              to: { name: 'tax-settings' },
              show: hasPermission('view_tax_settings'),
            },
          ],
        },
        {
          title: 'الاسئلة الشائعة',
          to: { name: 'questions-settings' },
          show: hasPermission('betrend_view_questions') && isBeTrendApp.value,
        },
        {
          title: 'الاسئلة الشائعة',
          to: { name: 'offers-questions-settings' },
          show: hasPermission('offers_view_questions') && isOffersApp.value,
        },
        {
          title: 'الاسئلة الشائعة',
          to: { name: 'ad-spaces-questions-settings' },
          show: hasPermission('ad_spaces_view_questions') && isAdSpacesApp.value,
        },
        {
          title: 'حسابات المعلنين',
          show: hasAtLeaseOnePermission([
            'view_ads_types',
            'view_discrimination_types',
            'view_account_cases',
            'view_subscription_settings',
          ]),
          to: null,
          children: [
            {
              title: 'أنواع الاعلانات',
              to: { name: 'ads-types-settings' },
              show: hasPermission('view_ads_types'),
            },
            {
              title: 'انواع تمييز الحسابات',
              to: { name: 'discrimination-types-settings' },
              show: hasPermission('view_discrimination_types'),
            },
            {
              title: 'حالات الحسابات',
              to: { name: 'accounts-cases-settings' },
              show: hasPermission('view_account_cases'),
            },
            {
              title: 'إعدادات الاشتراك',
              to: { name: 'subscription-settings' },
              show: hasPermission('view_subscription_settings'),
            },
          ],
        },
        {
          title: 'أسباب البلاغات',
          to: { name: 'reports-reasons-settings' },
          show: hasPermission('betrend_view_report_reasons') && isBeTrendApp.value,
        },
        {
          title: 'أسباب البلاغات',
          to: { name: 'offers-reports-reasons-settings' },
          show: hasPermission('offers_view_report_reasons') && isOffersApp.value,
        },
        {
          title: 'أسباب البلاغات',
          to: { name: 'ad-spaces-reports-reasons-settings' },
          show: hasPermission('ad_spaces_view_report_reasons') && isAdSpacesApp.value,
        },
        {
          title: 'عناصر التقييم',
          to: { name: 'rating-items-settings' },
          show: hasPermission('view_rate_types'),
        },
        {
          title: 'الشروط والاحكام',
          to: { name: 'terms-conditions-settings' },
          show: hasPermission('betrend_view_terms') && isBeTrendApp.value,
        },
        {
          title: 'الشروط والاحكام',
          to: { name: 'offers-terms-conditions-settings' },
          show: hasPermission('offers_view_terms') && isOffersApp.value,
        },
        {
          title: 'الشروط والاحكام',
          to: { name: 'ad-spaces-terms-conditions-settings' },
          show: hasPermission('ad_spaces_view_terms') && isAdSpacesApp.value,
        },
        {
          title: 'بنود إضافية للباقات',
          to: { name: 'subscription-extra-points-settings' },
          show: hasPermission('view_subscription_extra_points'),
        },
        {
          title: 'جديد المنصة',
          to: { name: 'platform-news-settings' },
          show: hasPermission('betrend_view_page_news') && isBeTrendApp.value,
        },
        {
          title: 'جديد المنصة',
          to: { name: 'offers-platform-news-settings' },
          show: hasPermission('offers_view_page_news') && isOffersApp.value,
        },
        {
          title: 'جديد المنصة',
          to: { name: 'ad-space-platform-news-settings' },
          show: hasPermission('ad_spaces_view_page_news') && isAdSpacesApp.value,
        },
        {
          title: 'شركاء النجاح',
          to: { name: 'partners-settings' },
          show: hasPermission('betrend_view_partners') && isBeTrendApp.value,
        },
        {
          title: 'شركاء النجاح',
          to: { name: 'offers-partners-settings' },
          show: hasPermission('offers_view_partners') && isOffersApp.value,
        },
        {
          title: 'شركاء النجاح',
          to: { name: 'ad-spaces-partners-settings' },
          show: hasPermission('ad_spaces_view_partners') && isAdSpacesApp.value,
        },
        {
          title: 'الفيديوهات التعريفية',
          to: { name: 'videos-settings' },
          show: hasPermission('betrend_view_videos') && isBeTrendApp.value,
        },
        {
          title: 'الفيديوهات التعريفية',
          to: { name: 'offers-videos-settings' },
          show: hasPermission('offers_view_videos') && isOffersApp.value,
        },
        {
          title: 'الفيديوهات التعريفية',
          to: { name: 'ad-spaces-videos-settings' },
          show: hasPermission('ad_spaces_view_videos') && isAdSpacesApp.value,
        },
        {
          title: 'من نحن',
          to: { name: 'about-us-settings' },
          show: hasPermission('betrend_view_abouts') && isBeTrendApp.value,
        },
        {
          title: 'من نحن',
          to: { name: 'offers-about-us-settings' },
          show: hasPermission('offers_view_abouts') && isOffersApp.value,
        },
        {
          title: 'من نحن',
          to: { name: 'ad-spaces-about-us-settings' },
          show: hasPermission('ad_spaces_view_abouts') && isAdSpacesApp.value,
        },
        {
          title: 'إعدادات التذاكر',
          to: { name: 'tickets-settings' },
          show: hasPermission('view_ticket_settings'),
        },
        {
          title: 'إعدادات الشات',
          to: { name: 'chat-settings' },
          show: hasPermission('view_chat_settings'),
        },
        {
          title: 'الردود الجاهزة',
          to: { name: 'ready-replies-settings' },
          show: hasPermission('betrend_view_admin_replies') && isBeTrendApp.value,
        },
        {
          title: 'الردود الجاهزة',
          to: { name: 'offers-ready-replies-settings' },
          show: hasPermission('offers_view_admin_replies') && isOffersApp.value,
        },
        {
          title: 'الردود الجاهزة',
          to: { name: 'ad-spaces-ready-replies-settings' },
          show: hasPermission('ad_spaces_view_admin_replies') && isAdSpacesApp.value,
        },
        {
          title: 'شرائح الميزانية',
          to: { name: 'budget-slides-settings' },
          show: hasPermission('view_budget_slides'),
        },
      ],
    },
    {
      title: 'العروض',
      icon: { icon: 'tabler-basket-discount' },
      show: hasAtLeaseOnePermission([
        'view_units',
        'view_offer_deadlines',
        'view_offer_payment_methods',
        'view_banners',
        'view_offers',
        'view_offer_settings',
        'view_remind_requests',
      ]),
      to: null,
      children: [
        {
          title: 'الوحدات',
          to: { name: 'offers-units' },
          show: hasPermission('view_units'),
        },
        {
          title: 'مهل دفع العرض',
          to: { name: 'offer-deadlines' },
          show: hasPermission('view_offer_deadlines'),
        },
        {
          title: 'طرق دفع العرض',
          to: { name: 'offer-payment-methods' },
          show: hasPermission('view_offer_payment_methods'),
        },
        {
          title: 'البنرات',
          to: { name: 'offers-banners' },
          show: hasPermission('view_banners'),
        },
        {
          title: 'العروض',
          to: { name: 'offers-page' },
          show: hasPermission('view_offers'),
        },
        {
          title: 'اعدادات تشغيل العروض',
          to: { name: 'offers-settings-page' },
          show: hasPermission('view_offer_settings'),
        },
        {
          title: 'طلبات التنبية',
          to: { name: 'reminders_requests-page' },
          show: hasPermission('view_remind_requests'),
        },
      ],
    },
    {
      title: 'المساحات',
      icon: { icon: 'tabler-ad-circle' },
      show: hasAtLeaseOnePermission([
        'view_distances',
        'view_views_prices',
        'view_ad_spaces',
        'view_ad_space_settings',
      ]),
      to: null,
      children: [
        {
          title: 'اعدادات المساحات',
          to: { name: 'ads-spaces-settings-page' },
          show: hasPermission('view_ad_space_settings'),
        },
        {
          title: 'المسافات',
          to: { name: 'ads-spaces-distances' },
          show: hasPermission('view_distances'),
        },
        {
          title: 'أسعار المشاهدات',
          to: { name: 'ads-spaces-views-prices' },
          show: hasPermission('view_views_prices'),
        },
        {
          title: 'المساحات',
          to: { name: 'ads-spaces-page' },
          show: hasPermission('view_ad_spaces'),
        },
      ],
    },
    {
      title: 'الاشتراكات',
      icon: { icon: 'tabler-package' },
      show: hasAtLeaseOnePermission([
        'view_subscription_requests',
        'view_subscription_requests_logs',
        'view_packages',
      ]),
      to: null,
      children: [
        {
          title: 'باقات الإشتراك',
          to: { name: 'subscriptions-packages-page' },
          show: hasPermission('view_packages'),
        },
        {
          title: 'طلبات الاشتراكات',
          to: { name: 'subscriptions-requests-page' },
          show: hasPermission('view_subscription_requests'),
        },
        {
          title: 'سجل الاشتراكات',
          to: { name: 'subscriptions-logs-page' },
          show: hasPermission('view_subscription_requests_logs'),
        },
      ],
    },
    {
      title: 'المعلنين',
      to: { name: 'advertisers-page' },
      icon: { icon: 'tabler-user-dollar' },
      show: hasPermission('view_advertisers'),
    },
    {
      title: 'المستخدمين',
      to: { name: 'users-page' },
      icon: { icon: 'tabler-user' },
      show: hasPermission('view_users'),
    },
    {
      title: 'الاعلانات',
      to: { name: 'ads-page' },
      icon: { icon: 'tabler-ad-2' },
      show: hasPermission('view_ads'),
    },
    {
      title: 'طلبات الاعلان',
      to: { name: 'ads-requests-page' },
      icon: { icon: 'tabler-file-check' },
      show: hasPermission('view_ads_requests'),
    },
    {
      title: 'فريق العمل',
      icon: { icon: 'tabler-users-group' },
      show: hasAtLeaseOnePermission(['view_admins', 'view_role_categories', 'view_roles']),
      to: null,
      children: [
        {
          title: 'الموظفين',
          to: { name: 'employees-page' },
          show: hasPermission('view_admins'),
        },
        {
          title: 'الصلاحيات',
          to: { name: 'team-roles-page' },
          show: hasPermission('view_roles'),
        },
        {
          title: 'الأقسام',
          to: { name: 'team-categories-page' },
          show: hasPermission('view_role_categories'),
        },
      ],
    },
    {
      title: 'المحافظ و الدفع الالكترونى',
      icon: { icon: 'tabler-wallet' },
      show: hasAtLeaseOnePermission([
        'view_payment_logs',
        'view_users_wallet',
        'view_withdraw_requests',
      ]),
      to: null,
      children: [
        {
          title: 'سجل العمليات',
          to: { name: 'payments-logs-page' },
          show: hasPermission('view_payment_logs'),
        },
        {
          title: 'محافظ المستخدمين',
          to: { name: 'users-wallets-page' },
          show: hasPermission('view_users_wallet'),
        },
        {
          title: 'سجل الصرف',
          to: { name: 'exchange-records-page' },
          show: hasPermission('view_withdraw_requests'),
        },
      ],
    },
    {
      title: 'النقاط والمكافآت',
      icon: { icon: 'tabler-gift' },
      show: hasAtLeaseOnePermission(['view_points_logs', 'view_users_points']),
      to: null,
      children: [
        {
          title: 'سجل النقاط',
          to: { name: 'points-logs-page' },
          show: hasPermission('view_points_logs'),
        },
        {
          title: 'نقاط المستخدمين',
          to: { name: 'users-points-page' },
          show: hasPermission('view_users_points'),
        },
      ],
    },
    {
      title: 'الكوبونات',
      icon: { icon: 'tabler-discount-2' },
      show: hasAtLeaseOnePermission([
        'view_platform_coupons',
        'view_advertiser_coupons',
        'view_ads_request_coupons',
        'view_stores',
      ]),
      to: null,
      children: [
        {
          title: 'كوبونات المنصة',
          to: { name: 'platform-coupons-page' },
          show: hasPermission('view_platform_coupons'),
        },
        {
          title: 'كوبونات المعلنين',
          to: { name: 'advertisers-coupons-page' },
          show: hasPermission('view_advertiser_coupons'),
        },
        {
          title: 'كوبونات التجار',
          to: { name: 'users-coupons-page' },
          show: hasPermission('view_ads_request_coupons'),
        },
        {
          title: 'المتاجر',
          to: { name: 'stores-page' },
          show: hasPermission('view_stores'),
        },
      ],
    },
    {
      title: 'البلاغات',
      icon: { icon: 'tabler-alert-hexagon' },
      show: hasAtLeaseOnePermission([
        'view_ads_reports',
        'view_advertiser_reports',
        'view_chat_reports',
        'view_chat_rates',
        'view_advertiser_blocks',
        'view_chat_blocks',
      ]),
      to: null,
      children: [
        {
          title: 'بلاغات الاعلانات',
          to: { name: 'ads-reports-page' },
          show: hasPermission('view_ads_reports'),
        },
        {
          title: 'بلاغات المعلنين',
          to: { name: 'advertisers-reports-page' },
          show: hasPermission('view_advertiser_reports'),
        },
        {
          title: 'بلاغات الشات',
          to: { name: 'chat-reports-page' },
          show: hasPermission('view_chat_reports'),
        },
        {
          title: 'تقييم الشات',
          to: { name: 'chat-rates-page' },
          show: hasPermission('view_chat_rates'),
        },
        {
          title: 'حظر عرض الاعلانات',
          to: { name: 'ads-block-page' },
          show: hasPermission('view_advertiser_blocks'),
        },
        {
          title: 'حظر المحادثات',
          to: { name: 'chat-block-page' },
          show: hasPermission('view_chat_blocks'),
        },
      ],
    },
    {
      title: 'التنازع',
      icon: { icon: 'tabler-analyze' },
      show: hasAtLeaseOnePermission([
        'view_dispute_procedures',
        'view_dispute_types',
        'view_disputes',
      ]),
      to: null,
      children: [
        {
          title: 'طلبات التنازع',
          to: { name: 'disputes-requests-page' },
          show: hasPermission('view_disputes'),
        },
        {
          title: 'أنواع التنازع / موظفي الدعم',
          to: { name: 'disputes-types-page' },
          show: hasPermission('view_dispute_types'),
        },
        {
          title: 'إجراءات التنازع',
          to: { name: 'disputes-procedures-page' },
          show: hasPermission('view_dispute_procedures'),
        },
      ],
    },
    {
      title: 'التذاكر',
      icon: { icon: 'tabler-ticket' },
      show: hasAtLeaseOnePermission([
        'view_tickets',
        'view_ticket_types',
        'view_ticket_categories',
      ]),
      to: null,
      children: [
        {
          title: 'تذاكر الدعم',
          to: { name: 'support-tickets-page' },
          show: hasPermission('view_tickets'),
        },
        {
          title: 'أنواع التذاكر',
          to: { name: 'tickets-types-page' },
          show: hasPermission('view_ticket_types'),
        },
        {
          title: 'أقسام التذاكر',
          to: { name: 'tickets-categories-page' },
          show: hasPermission('view_ticket_categories'),
        },
      ],
    },
    {
      title: 'التقارير',
      icon: { icon: 'tabler-report-analytics' },
      show: true,
      to: { name: 'statistics-index' },
    },
    {
      title: 'الاشعارات',
      to: { name: 'notifications-page' },
      icon: { icon: 'tabler-bell' },
      show: hasPermission('view_notifications'),
    },
    {
      title: 'سجل العمليات',
      to: { name: 'logs-page' },
      icon: { icon: 'tabler-history' },
      // TODO: ADD PERMISSION
      show: true,
    },
    {
      title: 'الشات',
      to: { name: 'chat-page' },
      icon: { icon: 'tabler-message' },
      // TODO: ADD PERMISSION
      show: true,
    },
  ]
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth)
injectSkinClasses()
getAuthUserPermissions()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getAuthUserPermissions() {
  isLoading.value = true
  getPermissions().then(() => {
    isLoading.value = false
  })
}

// #endregion
</script>

<template>
  <AppLoader v-if="isLoading" full-screen />
  <VerticalNavLayout v-else :nav-items="navItems" v-bind="layoutAttrs">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          id="vertical-nav-toggle-btn"
          class="ms-n3"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>
        <UserProfile />
        <NotificationsMenu />
        <NavBarI18n />
        <NavbarThemeSwitcher />

        <VSpacer />
        <MainAppsDropdown />
      </div>
    </template>

    <!-- 👉 Pages -->
    <AppLoader />
    <RouterView />
    <!--
      <RouterView v-slot="{ Component }">
      <Transition
      :name="appRouteTransition"
      mode="out-in"
      >
      <Component :is="Component" />
      </Transition>
      </RouterView>
    -->

    <!-- 👉 Footer -->
    <!--
      <template #footer>
      <Footer />
      </template>
    -->

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use '@layouts/styles/default-layout';
</style>
