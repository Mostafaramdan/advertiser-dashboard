<script lang="ts" setup>
import { authService } from '@/services/AuthService'
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

const { setUserPermissions } = useAuthStore()
const isLoading = ref<boolean>(false)

const { canAccessPage, canAccessAtLeastOnePage, hasAtLeaseOnePermission, hasPermission } =
  useAuthStore()

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
      show: canAccessPage('settings'),
      to: null,
      children: [
        {
          title: 'اعدادات حساب المنصة',
          show: canAccessAtLeastOnePage([
            'general_settings',
            'social_settings',
            'schedule_settings',
            'billing_cards',
          ]),
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'platform-settings-details' },
              show: canAccessPage('general_settings'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'social-accounts-settings' },
              show: canAccessPage('social_settings'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'work-time-settings' },
              show: canAccessPage('schedule_settings'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'payment-methods-settings' },
              show: canAccessPage('billing_cards'),
            },
          ],
        },
        {
          title: 'الدول',
          to: { name: 'countries-settings' },
          show: canAccessPage('countries'),
        },
        {
          title: 'الكيانات',
          to: { name: 'entities-settings' },
          show: canAccessPage('entities'),
        },
        {
          title: 'الاقسام',
          to: { name: 'categories-settings' },
          show: canAccessPage('categories'),
        },
        {
          title: 'القنوات',
          to: { name: 'channels-settings' },
          show: canAccessPage('channels'),
        },
        {
          title: 'اعدادات التشغيل',
          to: { name: 'ads-settings' },
          show: canAccessPage('ads_settings'),
        },
        {
          title: 'الإعدادات المالية',
          show: canAccessAtLeastOnePage([
            'financial_settings',
            'payment_commissions',
            'point_settings',
            'tax_settings',
          ]),
          to: null,
          children: [
            {
              title: 'اعدادت الحسابات',
              to: { name: 'accounts-settings' },
              show: canAccessPage('financial_settings'),
            },
            {
              title: 'شرائح عمولة الدفع',
              to: { name: 'payment-commission-settings' },
              show: canAccessPage('payment_commissions'),
            },
            {
              title: 'اعدادت النقاط',
              to: { name: 'points-settings' },
              show: canAccessPage('point_settings'),
            },
            {
              title: 'اعدادت الضريبة',
              to: { name: 'tax-settings' },
              show: canAccessPage('tax_settings'),
            },
          ],
        },
        {
          title: 'الاسئلة الشائعة',
          to: { name: 'questions-settings' },
          show: canAccessPage('questions'),
        },
        {
          title: 'حسابات المعلنين',
          show: canAccessAtLeastOnePage([
            'ads_types',
            'discrimination_types',
            'account_cases',
            'subscription_settings',
          ]),
          to: null,
          children: [
            {
              title: 'أنواع الاعلانات',
              to: { name: 'ads-types-settings' },
              show: canAccessPage('ads_types'),
            },
            {
              title: 'انواع تمييز الحسابات',
              to: { name: 'discrimination-types-settings' },
              show: canAccessPage('discrimination_types'),
            },
            {
              title: 'حالات الحسابات',
              to: { name: 'accounts-cases-settings' },
              show: canAccessPage('account_cases'),
            },
            {
              title: 'إعدادات الاشتراك',
              to: { name: 'subscription-settings' },
              show: canAccessPage('subscription_settings'),
            },
          ],
        },
        {
          title: 'أسباب البلاغات',
          to: { name: 'reports-reasons-settings' },
          show: canAccessPage('report_reasons'),
        },
        {
          title: 'عناصر التقييم',
          to: { name: 'rating-items-settings' },
          show: canAccessPage('rate_types'),
        },
        {
          title: 'الشروط والاحكام',
          to: { name: 'terms-conditions-settings' },
          show: canAccessPage('terms'),
        },
        {
          title: 'بنود إضافية للباقات',
          to: { name: 'subscription-extra-points-settings' },
          show: canAccessPage('subscription_extra_points'),
        },
        {
          title: 'جديد المنصة',
          to: { name: 'platform-news-settings' },
          show: canAccessPage('page_news'),
        },
        {
          title: 'شركاء النجاح',
          to: { name: 'partners-settings' },
          show: canAccessPage('partners'),
        },
        {
          title: 'الفيديوهات التعريفية',
          to: { name: 'videos-settings' },
          show: canAccessPage('videos'),
        },
        {
          title: 'من نحن',
          to: { name: 'about-us-settings' },
          show: canAccessPage('abouts'),
        },
        {
          title: 'إعدادات التذاكر',
          to: { name: 'tickets-settings' },
          show: canAccessPage('ticket_settings'),
        },
        {
          title: 'إعدادات الشات',
          to: { name: 'chat-settings' },
          show: canAccessPage('chat_settings'),
        },
      ],
    },
    {
      title: 'الاشتراكات',
      icon: { icon: 'tabler-package' },
      show: canAccessAtLeastOnePage([
        'subscription_requests',
        'subscription_requests_logs',
        'packages',
      ]),
      to: null,
      children: [
        {
          title: 'باقات الإشتراك',
          to: { name: 'subscriptions-packages-page' },
          show: canAccessPage('packages'),
        },
        {
          title: 'طلبات الاشتراكات',
          to: { name: 'subscriptions-requests-page' },
          show: canAccessPage('subscription_requests'),
        },
        {
          title: 'سجل الاشتراكات',
          to: { name: 'subscriptions-logs-page' },
          show: canAccessPage('subscription_requests_logs'),
        },
      ],
    },
    {
      title: 'المعلنين',
      to: { name: 'advertisers-page' },
      icon: { icon: 'tabler-user-dollar' },
      show: canAccessPage('advertisers'),
    },
    {
      title: 'المستخدمين',
      to: { name: 'users-page' },
      icon: { icon: 'tabler-user' },
      show: canAccessPage('users'),
    },
    {
      title: 'الاعلانات',
      to: { name: 'ads-page' },
      icon: { icon: 'tabler-ad-2' },
      show: canAccessPage('ads'),
    },
    {
      title: 'طلبات الاعلان',
      to: { name: 'ads-requests-page' },
      icon: { icon: 'tabler-file-check' },
      show: canAccessPage('ads_requests'),
    },
    {
      title: 'الكوبونات',
      icon: { icon: 'tabler-discount-2' },
      show: hasAtLeaseOnePermission(['view_advertiser_coupons']),
      to: null,
      children: [
        {
          title: 'كوبونات المنصة',
          to: { name: 'platform-coupons-page' },
          show: hasPermission('view_advertiser_coupons'),
        },
      ],
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
getPermissions()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPermissions() {
  isLoading.value = true
  authService
    .getPermissions()
    .then((res: any) => {
      setUserPermissions(res.data.data)
    })
    .finally(() => {
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
