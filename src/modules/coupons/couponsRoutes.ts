export const couponsRoutes = [
  {
    path: 'platform',
    name: 'platform-coupons-page',
    component: () => import('./pages/PlatformCoupons.vue'),
    meta: {
      requiredPermission: 'view_advertiser_coupons',
    },
  },
]
