export const couponsRoutes = [
  {
    path: 'platform',
    name: 'platform-coupons-page',
    component: () => import('./pages/PlatformCouponsPage.vue'),
    meta: {
      requiredPermission: 'view_advertiser_coupons',
    },
  },
  {
    path: 'platform/:id',
    name: 'platform-coupons-history-page',
    component: () => import('./pages/PlatformCouponsHistoryPage.vue'),
    meta: {
      requireAtLeastOnePermission: [
        'view_coupon_subscriber_logs',
        'view_coupon_transactions_history',
      ],
    },
  },
  {
    path: 'stores',
    name: 'stores-page',
    component: () => import('./pages/StoresPage.vue'),
    meta: {
      requiredPermission: 'view_stores',
    },
  },
  {
    path: 'advertisers',
    name: 'advertisers-coupons-page',
    component: () => import('./pages/AdvertisersCouponsPage.vue'),
    meta: {
      requiredPermission: 'view_advertiser_coupons',
    },
  },
  {
    path: 'users',
    name: 'users-coupons-page',
    component: () => import('./pages/UsersCouponsPage.vue'),
    meta: {
      requiredPermission: 'view_ads_request_coupons',
    },
  },
]
