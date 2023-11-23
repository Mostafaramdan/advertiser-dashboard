<script lang="ts" setup>
import NotificationsMenu from '@/components/dashboard-notifications/NotificationsMenu.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import AppLoader from './components/AppLoader.vue'

import NavBarI18n from '@/layouts/components/NavBarI18n.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

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

const { setUserPermissions, getPermissions } = useAuthStore()
const isLoading = ref<boolean>(false)

const { hasAtLeaseOnePermission, hasPermission } = useAuthStore()

// #endregion

/***************************************
 **** Section Computed Declaration ****
 **************************************/
// #region Computed
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
      show: hasPermission('view_settings'),
      to: null,
      children: [
        {
          title: 'إعدادت حساب المنصة',
          show: hasAtLeaseOnePermission([
            'view_general_settings',
            'view_social_settings',
            'view_schedule_settings',
            'view_billing_cards',
          ]),
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'platform-settings-details' },
              show: hasPermission('view_general_settings'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'social-accounts-settings' },
              show: hasPermission('view_social_settings'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'work-time-settings' },
              show: hasPermission('view_schedule_settings'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'payment-methods-settings' },
              show: hasPermission('view_billing_cards'),
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
          show: hasPermission('view_questions'),
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
          show: hasPermission('view_report_reasons'),
        },
        {
          title: 'عناصر التقييم',
          to: { name: 'rating-items-settings' },
          show: hasPermission('view_rate_types'),
        },
        {
          title: 'الشروط والاحكام',
          to: { name: 'terms-conditions-settings' },
          show: hasPermission('view_terms'),
        },
        {
          title: 'بنود إضافية للباقات',
          to: { name: 'subscription-extra-points-settings' },
          show: hasPermission('view_subscription_extra_points'),
        },
        {
          title: 'جديد المنصة',
          to: { name: 'platform-news-settings' },
          show: hasPermission('view_page_news'),
        },
        {
          title: 'شركاء النجاح',
          to: { name: 'partners-settings' },
          show: hasPermission('view_partners'),
        },
        {
          title: 'الفيديوهات التعريفية',
          to: { name: 'videos-settings' },
          show: hasPermission('view_videos'),
        },
        {
          title: 'من نحن',
          to: { name: 'about-us-settings' },
          show: hasPermission('view_abouts'),
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
          show: hasPermission('view_admin_replies'),
        },
        {
          title: 'شرائح الميزانية',
          to: { name: 'budget-slides-settings' },
          show: hasPermission('view_budget_slides'),
        },
        {
          title: 'الوحدات',
          to: { name: 'units-settings' },
          show: hasPermission('view_units'),
        },
        {
          title: 'المسافات',
          to: { name: 'distances-settings' },
          show: hasPermission('view_distances'),
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
      to: { name: 'wallets-and-payments-page' },
      icon: { icon: 'tabler-wallet' },
      show: true,
    },
    {
      title: 'النقاط والمكافآت',
      to: { name: 'points-and-prizes-page' },
      icon: { icon: 'tabler-gift' },
      show: true,
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

        <NavBarI18n />
        <NavbarThemeSwitcher />

        <VSpacer />
        <NotificationsMenu />
        <UserProfile />
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
