export const statisticsRoutes = [
  {
    path: 'index',
    name: 'statistics-index',
    component: () => import('./pages/IndexPage.vue'),
  },
  {
    path: 'subscriptions',
    name: 'subscriptions-statistics',
    component: () => import('./pages/SubscriptionsPage.vue'),
  },
  {
    path: 'packages',
    name: 'packages-statistics',
    component: () => import('./pages/PackagesPage.vue'),
  },
  {
    path: 'subscribers',
    name: 'subscribers-statistics',
    component: () => import('./pages/SubscribersPage.vue'),
  },
  {
    path: 'users',
    name: 'users-statistics',
    component: () => import('./pages/UsersPage.vue'),
  },
  {
    path: 'guests',
    name: 'guests-statistics',
    component: () => import('./pages/GuestsPage.vue'),
  },
  {
    path: 'visits',
    name: 'visits-statistics',
    component: () => import('./pages/VisitsPage.vue'),
  },
  {
    path: 'ads',
    name: 'ads-statistics',
    component: () => import('./pages/AdsPage.vue'),
  },
  {
    path: 'coupons',
    name: 'coupons-statistics',
    component: () => import('./pages/CouponsPage.vue'),
  },
  {
    path: 'requests',
    name: 'requests-statistics',
    component: () => import('./pages/RequestsPage.vue'),
  },
  {
    path: 'documents',
    name: 'documents-statistics',
    component: () => import('./pages/DocumentsPage.vue'),
  },
]
