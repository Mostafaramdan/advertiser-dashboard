export const paymentsRoutes = [
  {
    path: 'logs',
    name: 'payments-logs-page',
    component: () => import('./pages/LogsPage.vue'),
    meta: {
      requiredPermission: 'view_payment_logs',
    },
  },
  {
    path: 'users-wallets',
    name: 'users-wallets-page',
    component: () => import('./pages/UsersWalletsPage.vue'),
    meta: {
      requiredPermission: 'view_users_wallet',
    },
  },
  {
    path: 'exchange-records',
    name: 'exchange-records-page',
    component: () => import('./pages/ExchangeRecordsPage.vue'),
    meta: {
      requiredPermission: 'view_withdraw_requests',
    },
  },
]
