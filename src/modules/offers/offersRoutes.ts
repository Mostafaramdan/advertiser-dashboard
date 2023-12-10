export const offersRoutes = [
  {
    path: 'units',
    name: 'offers-units',
    component: () => import('./pages/UnitsPage.vue'),
    meta: {
      requiredPermission: 'view_units',
    },
  },
  {
    path: 'offer-deadlines',
    name: 'offer-deadlines',
    component: () => import('./pages/OfferDeadlinesPage.vue'),
    meta: {
      requiredPermission: 'view_offer_deadlines',
    },
  },
  {
    path: 'offer-payment-methods',
    name: 'offer-payment-methods',
    component: () => import('./pages/OfferPaymentMethodsPage.vue'),
    meta: {
      requiredPermission: 'view_offer_payment_methods',
    },
  },
  {
    path: 'banners',
    name: 'offers-banners',
    component: () => import('./pages/BannersPage.vue'),
    meta: {
      requiredPermission: 'view_banners',
    },
  },
  {
    path: 'banners/create',
    name: 'banners-create-page',
    component: () => import('./pages/BannerCreatePage.vue'),
    meta: {
      layout: 'default',
      requiredPermission: 'create_banner',
    },
  },
  {
    path: 'banners/:id/edit',
    name: 'banners-edit-page',
    component: () => import('./pages/BannerEditPage.vue'),
    meta: {
      layout: 'default',
      requiredPermission: 'update_banner',
    },
  },
  {
    path: 'index',
    name: 'offers-page',
    component: () => import('./pages/OffersPage.vue'),
    meta: {
      requiredPermission: 'view_offers',
    },
  },
  {
    path: 'index/create',
    name: 'offer-create-page',
    component: () => import('./pages/OfferCreatePage.vue'),
    meta: {
      requiredPermission: 'create_offer',
    },
  },
  {
    path: 'index/:id/edit',
    name: 'offer-edit-page',
    component: () => import('./pages/OfferEditPage.vue'),
    meta: {
      requiredPermission: 'update_offer',
    },
  },
  {
    path: 'index/:id/details',
    name: 'offer-details-page',
    component: () => import('./pages/OfferDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_offers',
    },
  },
]
