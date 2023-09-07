export const subscriptionsRoutes = [
  {
    path: 'list',
    name: 'subscriptions-list-page',
    component: () => import('./pages/SubscriptionsListPage.vue'),
    meta: {
      requireAccess: 'packages',
    },
  },
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
