export const subscriptionsRoutes = [
  {
    path: 'packages',
    name: 'subscriptions-packages-page',
    component: () => import('./pages/SubscriptionsPackagesPage.vue'),
    meta: {
      requireAccess: 'packages',
    },
  },
  {
    path: 'packages/create',
    name: 'subscriptions-create-package-page',
    component: () => import('./pages/SubscriptionCreatePackagePage.vue'),
    meta: {
      requiredPermission: 'create_package',
    },
  },
  {
    path: 'packages/:id/edit',
    name: 'subscriptions-edit-package-page',
    component: () => import('./pages/SubscriptionEditPackagePage.vue'),
    meta: {
      requiredPermission: 'update_package',
    },
  },
  {
    path: 'packages/:id/details',
    name: 'subscriptions-package-details-page',
    component: () => import('./pages/SubscriptionPackageDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_package_details',
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
