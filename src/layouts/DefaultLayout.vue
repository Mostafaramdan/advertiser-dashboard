<script lang="ts" setup>
import AppLoader from './components/AppLoader.vue'
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'

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
const { switchToVerticalNavOnLtOverlayNavBreakpoint, isLessThanOverlayNavBreakpoint } = useThemeConfig()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
const { layoutAttrs, injectSkinClasses } = useSkins()

const { setUserPermissions } = useAuthStore()
const isLoading = ref<boolean>(false)

const { canAccessPage } = useAuthStore()

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
      show: canAccessPage('Settings'),
      to: null,
      children: [
        {
          title: 'اعدادات حساب المنصة',
          show: canAccessPage('Entity'),
          to: null,
          children: [
            {
              title: 'بيانات المنصة',
              to: { name: 'platform-settings-details' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'حسابات التواصل',
              to: { name: 'social-accounts-settings' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'دوام المنصة',
              to: { name: 'work-time-settings' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'طرق الدفع',
              to: { name: 'payment-methods-settings' },
              show: canAccessPage('Entity'),
            },
          ],
        },
        {
          title: 'الكيانات',
          to: { name: 'entities-settings' },
          show: canAccessPage('Entity'),
        },
        {
          title: 'النشاطات',
          to: { name: 'categories-settings' },
          show: canAccessPage('Entity'),
        },
        {
          title: 'القنوات',
          to: { name: 'channels-settings' },
          show: canAccessPage('Channel'),
        },
        {
          title: 'اعدادات التشغيل',
          to: { name: 'ads-settings' },
          show: canAccessPage('AdSettings'),
        },
        {
          title: 'الإعدادات المالية',
          show: canAccessPage('Entity'),
          to: null,
          children: [
            {
              title: 'اعدادت الحسابات',
              to: { name: 'accounts-settings' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'شرائح عمولة الدفع',
              to: { name: 'payment-commission-settings' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'اعدادت النقاط',
              to: { name: 'points-settings' },
              show: canAccessPage('Entity'),
            },
            {
              title: 'اعدادت الضريبة',
              to: { name: 'tax-settings' },
              show: canAccessPage('Entity'),
            },
          ],
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
  authService.getPermissions().then((res: any) => {
    setUserPermissions(res.data.data)
  }).finally(() => {
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
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
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
@use "@layouts/styles/default-layout";
</style>
