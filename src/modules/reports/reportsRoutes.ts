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
  {
    path: 'chat-rates',
    name: 'chat-rates-page',
    component: () => import('./pages/ChatRatesPage.vue'),
    meta: {
      requiredPermission: 'view_chat_rates',
    },
  },
  {
    path: 'ads-block',
    name: 'ads-block-page',
    component: () => import('./pages/AdsBlockPage.vue'),
    meta: {
      requiredPermission: 'view_advertiser_blocks',
    },
  },
  {
    path: 'chat-block',
    name: 'chat-block-page',
    component: () => import('./pages/ChatBlockPage.vue'),
    meta: {
      requiredPermission: 'view_chat_blocks',
    },
  },
  {
    path: 'chat-block/:id',
    name: 'chat-block-details-page',
    component: () => import('./pages/ChatBlockDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_chat_block_details',
    },
  },
]
