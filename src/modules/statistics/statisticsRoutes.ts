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
    path: 'users',
    name: 'users-statistics',
    component: () => import('./pages/UsersPage.vue'),
  },
  {
    path: 'guests',
    name: 'guests-statistics',
    component: () => import('./pages/GuestsPage.vue'),
  },
]
