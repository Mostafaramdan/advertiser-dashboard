import { couponsRoutes } from '@/modules/coupons/couponsRoutes'
import { disputesRoutes } from '@/modules/disputes/disputesRoutes'
import { reportsRoutes } from '@/modules/reports/reportsRoutes'
import { settingsRoutes } from '@/modules/settings/settingsRoutes'
import { statisticsRoutes } from '@/modules/statistics/statisticsRoutes'
import { subscriptionsRoutes } from '@/modules/subscriptions/subscriptionsRoutes'
import { teamRoutes } from '@/modules/team/teamRoutes'
import { ticketsRoutes } from '@/modules/tickets/ticketsRoutes'
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
      path: '/test-page',
      name: 'test-page',
      component: () => import('@/pages/TestPage2.vue'),
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
        requiredPermission: 'view_settings',
      },
      children: settingsRoutes,
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('@/modules/subscriptions/subscriptionsModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: [
          'view_subscription_requests',
          'view_subscription_requests_logs',
          'view_packages',
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
        requiredPermission: 'view_advertisers',
      },
    },
    {
      path: '/advertisers/:id',
      name: 'advertisers-profile-page',
      component: () => import('@/pages/AdvertiserProfilePage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_advertiser_details',
      },
    },
    {
      path: '/users',
      name: 'users-page',
      component: () => import('@/pages/UsersPage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_users',
      },
    },
    {
      path: '/users/:id',
      name: 'user-profile-page',
      component: () => import('@/pages/UserProfilePage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_advertiser_details',
      },
    },
    {
      path: '/ads',
      name: 'ads-page',
      component: () => import('@/pages/AdsPage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_ads',
      },
    },
    {
      path: '/ads/:id',
      name: 'ad-details-page',
      component: () => import('@/pages/AdDetailsPage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_ads_details',
      },
    },
    {
      path: '/ads-requests',
      name: 'ads-requests-page',
      component: () => import('@/pages/AdsRequestsPage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_ads_requests',
      },
    },
    {
      path: '/ads-requests/:id',
      name: 'ads-request-details-page',
      component: () => import('@/pages/AdsRequestDetailsPage.vue'),
      meta: {
        layout: 'default',
        requiredPermission: 'view_ads_requests_details',
      },
    },
    {
      path: '/wallets-and-payments',
      name: 'wallets-and-payments-page',
      component: () => import('@/pages/WalletsAndPaymentsPage.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/points-and-prizes',
      name: 'points-and-prizes-page',
      component: () => import('@/pages/PointsAndPrizesPage.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: () => import('@/modules/coupons/CouponsModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: [
          'view_platform_coupons',
          'view_stores',
          'view_advertiser_coupons',
          'view_ads_request_coupons',
        ],
      },
      children: couponsRoutes,
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/modules/reports/ReportsModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: [
          'view_ads_reports',
          'view_advertiser_reports',
          'view_chat_reports',
          'view_chat_rates',
          'view_advertiser_blocks',
          'view_chat_blocks',
        ],
      },
      children: reportsRoutes,
    },
    {
      path: '/disputes',
      name: 'disputes',
      component: () => import('@/modules/disputes/DisputesModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: [
          'view_dispute_procedures',
          'view_dispute_types',
          'view_disputes',
          'view_dispute_details',
        ],
      },
      children: disputesRoutes,
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('@/modules/tickets/TicketsModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: [
          'view_tickets',
          'view_ticket_types',
          'view_ticket_categories',
        ],
      },
      children: ticketsRoutes,
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/modules/team/TeamModule.vue'),
      meta: {
        layout: 'default',
        requireAtLeastOnePermission: ['view_admins', 'view_role_categories', 'view_roles'],
      },
      children: teamRoutes,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/modules/statistics/StatisticsModule.vue'),
      meta: {
        layout: 'default',
      },
      children: statisticsRoutes,
    },
    {
      path: '/notifications',
      name: 'notifications-page',
      component: () => import('@/pages/NotificationsPage.vue'),
      meta: {
        layout: 'default',
        hasPermission: 'view_notifications',
      },
    },
    {
      path: '/dashboard-notifications',
      name: 'dashboard-notifications-page',
      component: () => import('@/pages/DashboardNotificationsPage.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/logs',
      name: 'logs-page',
      component: () => import('@/pages/LogsPage.vue'),
      meta: {
        layout: 'default',
        // TODO: Add permission
        // hasPermission: 'view_notifications',
      },
    },
    {
      path: '/chat',
      name: 'chat-page',
      component: () => import('@/pages/ChatPage.vue'),
      meta: {
        layout: 'default',
        // TODO: ADD PERMISSION
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
  const { isAuthUser, hasPermission, hasAtLeaseOnePermission } = useAuthStore()

  if (to.meta.layout === 'default' && !isAuthUser)
    next({ name: 'login-page', query: { redirect: to.fullPath } })

  if (
    isAuthUser &&
    to.meta.requireAtLeastOnePermission &&
    !hasAtLeaseOnePermission(to.meta.requireAtLeastOnePermission as string[])
  )
    next({ name: 'error-page', query: { message: 'errors.you_are_not_authorized' } })

  if (
    isAuthUser &&
    to.meta.requiredPermission &&
    !hasPermission(to.meta.requiredPermission as string)
  )
    next({ name: 'error-page', query: { message: 'errors.you_are_not_authorized' } })

  next()
})

export default router
