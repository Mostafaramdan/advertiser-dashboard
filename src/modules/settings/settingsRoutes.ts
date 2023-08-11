export const settingsRoutes = [
  {
    path: 'entities',
    name: 'entities-settings',
    component: () => import('./pages/EntitiesPage.vue'),
    meta: {
      requiredAccess: 'Entity',
    },
  },
  {
    path: 'categories',
    name: 'categories-settings',
    component: () => import('./pages/CategoriesPage.vue'),
    meta: {
      requiredAccess: 'Entity',
    },
  },
  {
    path: 'channels',
    name: 'channels-settings',
    component: () => import('./pages/ChannelsPage.vue'),
    meta: {
      requiredAccess: 'Channel',
    },
  },
  {
    path: 'platform',
    name: 'platform-settings',
    component: () => import('./pages/platform/index.vue'),
    meta: {
      requiredAccess: 'Entity',
    },
    children: [
      {
        path: 'details',
        name: 'platform-settings-details',
        component: () => import('./pages/platform/DetailsPage.vue'),
        meta: {
          requiredAccess: 'Entity',
        },
      },
      {
        path: 'social-accounts',
        name: 'social-accounts-settings',
        component: () => import('./pages/platform/SocialAccountsPage.vue'),
        meta: {
          requiredAccess: 'Entity',
        },
      },
      {
        path: 'work-time',
        name: 'work-time-settings',
        component: () => import('./pages/platform/WorkTimePage.vue'),
        meta: {
          requiredAccess: 'Entity',
        },
      },
      {
        path: 'payment-methods',
        name: 'payment-methods-settings',
        component: () => import('./pages/platform/PaymentMethodsPage.vue'),
        meta: {
          requiredAccess: 'Entity',
        },
      },
    ],
  },
]
