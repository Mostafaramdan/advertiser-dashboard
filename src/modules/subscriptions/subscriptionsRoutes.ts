export const subscriptionsRoutes = [
  {
    path: 'requests',
    name: 'subscriptions-requests-page',
    component: () => import('./pages/SubscriptionsRequestsPage.vue'),
    meta: {
      requireAccess: 'subscription_requests',
    },
  },
  {
    path: 'logs',
    name: 'subscriptions-logs-page',
    component: () => import('./pages/SubscriptionsLogsPage.vue'),
    meta: {
      requireAccess: 'subscription_requests_logs',
    },
  },
]
