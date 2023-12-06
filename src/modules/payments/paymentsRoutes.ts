export const paymentsRoutes = [
  {
    path: 'logs',
    name: 'payments-logs-page',
    component: () => import('./pages/LogsPage.vue'),
    meta: {
      // requiredPermission: '',
    },
  },
]
