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
]
