export const adsSpacesRoutes = [
  {
    path: 'distances',
    name: 'ads-spaces-distances',
    component: () => import('./pages/DistancesPage.vue'),
    meta: {
      requiredPermission: 'view_distances',
    },
  },
  {
    path: 'views-prices',
    name: 'ads-spaces-views-prices',
    component: () => import('./pages/ViewsPricesPage.vue'),
    meta: {
      requiredPermission: 'view_views_prices',
    },
  },
  {
    path: 'index',
    name: 'ads-spaces-page',
    component: () => import('./pages/AdsSpacesPage.vue'),
    meta: {
      requiredPermission: 'view_ad_spaces',
    },
  },
  {
    path: 'index/:id/details',
    name: 'ads-space-details-page',
    component: () => import('./pages/AdsSpaceDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_ad_space_details',
    },
  },
]
