<script lang="ts" setup>
import AppLoader from './AppLoader.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'

// Components
// import Footer from '@/layouts/components/Footer.vue'

import NavBarI18n from '@/layouts/components/NavBarI18n.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// @layouts plugin
import { useAuthStore } from '@/stores/AuthStore'
import { VerticalNavLayout } from '@layouts'

const {
  // appRouteTransition,
  isLessThanOverlayNavBreakpoint,
} = useThemeConfig()

const { width: windowWidth } = useWindowSize()

const { canAccessPage } = useAuthStore()

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
      ],
    },

  ]
})
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
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
