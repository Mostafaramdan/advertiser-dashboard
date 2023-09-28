export const reportsRoutes = [
  {
    path: 'ads',
    name: 'ads-reports-page',
    component: () => import('./pages/AdsReportsPage.vue'),
    meta: {
      requiredPermission: 'view_ads_reports',
    },
  },
]
