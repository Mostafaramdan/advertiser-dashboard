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
    path: 'stores',
    name: 'stores-page',
    component: () => import('./pages/StoresPage.vue'),
    meta: {
      requiredPermission: 'view_stores',
    },
  },
]
