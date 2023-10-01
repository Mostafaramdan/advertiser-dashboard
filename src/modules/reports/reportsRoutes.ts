export const reportsRoutes = [
  {
    path: 'ads',
    name: 'ads-reports-page',
    component: () => import('./pages/AdsReportsPage.vue'),
    meta: {
      requiredPermission: 'view_ads_reports',
    },
  },
  {
    path: 'advertisers',
    name: 'advertisers-reports-page',
    component: () => import('./pages/AdvertisersReportsPage.vue'),
    meta: {
      requiredPermission: 'view_advertiser_reports',
    },
  },
  {
    path: 'chat',
    name: 'chat-reports-page',
    component: () => import('./pages/ChatReportsPage.vue'),
    meta: {
      requiredPermission: 'view_chat_reports',
    },
  },
]
