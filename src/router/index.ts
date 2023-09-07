import { settingsRoutes } from '@/modules/settings/settingsRoutes'
import { subscriptionsRoutes } from '@/modules/subscriptions/subscriptionsRoutes'
import HomePage from '@/pages/HomePage.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/test-form',
      name: 'test-form',
      component: () => import('@/pages/TestForm.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        layout: 'forms',
      },
    },
    {
      path: '/forget-password',
      name: 'forget-password-page',
      component: () => import('@/pages/ForgetPasswordPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/reset-password',
      name: 'reset-password-page',
      component: () => import('@/pages/ResetPasswordPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/modules/settings/settingsModule.vue'),
      meta: {
        layout: 'default',
        requireAccess: 'settings',
      },
      children: settingsRoutes,
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('@/modules/subscriptions/subscriptionsModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOneAccess: [
          'subscription_requests',
          'subscription_requests_logs',
          'packages',
        ],
      },
      children: subscriptionsRoutes,
    },
    {
      path: '/advertisers',
      name: 'advertisers-page',
      component: () => import('@/pages/AdvertisersPage.vue'),
      meta: {
        layout: 'default',
        requireAccess: 'advertisers',
      },
    },
    {
      path: '/advertisers/:id',
      name: 'advertisers-profile-page',
      component: () => import('@/pages/AdvertiserProfilePage.vue'),
      meta: {
        layout: 'default',
        requireAccess: 'advertiser_details',
      },
    },
    {
      path: '/users',
      name: 'users-page',
      component: () => import('@/pages/UsersPage.vue'),
      meta: {
        layout: 'default',
        requireAccess: 'users',
      },
    },
    {
      path: '/users/:id',
      name: 'user-profile-page',
      component: () => import('@/pages/UserProfilePage.vue'),
      meta: {
        layout: 'default',
        requireAccess: 'advertiser_details',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error-page',
      component: () => import('@/pages/ErrorPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { isAuthUser, canAccessPage, canAccessAtLeastOnePage } = useAuthStore()

  if (to.meta.layout === 'default' && !isAuthUser)
    next({ name: 'login-page', query: { redirect: to.fullPath } })

  if (isAuthUser && to.meta.requiredAccess && !canAccessPage(to.meta.requiredAccess as string))
    next({ name: 'error-page', query: { message: 'errors.you_are_not_authorized' } })

  if (
    isAuthUser &&
    to.meta.requireAtLeastOneAccess &&
    !canAccessAtLeastOnePage(to.meta.requireAtLeastOneAccess as string[])
  )
    next({ name: 'error-page', query: { message: 'errors.you_are_not_authorized' } })

  next()
})

export default router
