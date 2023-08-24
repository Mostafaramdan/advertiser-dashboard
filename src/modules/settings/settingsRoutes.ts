export const settingsRoutes = [
  {
    path: 'countries',
    name: 'countries-settings',
    component: () => import('./pages/CountriesPage.vue'),
    meta: {
      requiredAccess: 'countries',
    },
  },
  {
    path: 'countries/:id/areas',
    name: 'areas-settings',
    component: () => import('./pages/AreasPage.vue'),
    meta: {
      requiredAccess: 'areas',
    },
  },
  {
    path: 'entities',
    name: 'entities-settings',
    component: () => import('./pages/EntitiesPage.vue'),
    meta: {
      requiredAccess: 'entities',
    },
  },
  {
    path: 'categories',
    name: 'categories-settings',
    component: () => import('./pages/CategoriesPage.vue'),
    meta: {
      requiredAccess: 'categories',
    },
  },
  {
    path: 'ads-settings',
    name: 'ads-settings',
    component: () => import('./pages/AdsSettingsPage.vue'),
    meta: {
      requiredAccess: 'ads_settings',
    },
  },
  {
    path: 'channels',
    name: 'channels-settings',
    component: () => import('./pages/ChannelsPage.vue'),
    meta: {
      requiredAccess: 'channels',
    },
  },
  {
    path: 'reports-reasons',
    name: 'reports-reasons-settings',
    component: () => import('./pages/ReportsReasons.vue'),
    meta: {
      requiredAccess: 'report_reasons',
    },
  },
  {
    path: 'questions',
    name: 'questions-settings',
    component: () => import('./pages/QuestionsPage.vue'),
    meta: {
      requiredAccess: 'questions',
    },
  },
  {
    path: 'rating-items',
    name: 'rating-items-settings',
    component: () => import('./pages/RateItemsPage.vue'),
    meta: {
      requiredAccess: 'rate_types',
    },
  },
  {
    path: 'terms-and-conditions',
    name: 'terms-conditions-settings',
    component: () => import('./pages/TermsConditionsPage.vue'),
    meta: {
      requiredAccess: 'terms',
    },
  },
  {
    path: 'subscription-extra-points',
    name: 'subscription-extra-points-settings',
    component: () => import('./pages/SubscriptionExtraPointsPage.vue'),
    meta: {
      requiredAccess: 'subscription_extra_points',
    },
  },
  {
    path: 'platform-news',
    name: 'platform-news-settings',
    component: () => import('./pages/PlatformNewsPage.vue'),
    meta: {
      requiredAccess: 'page_news',
    },
  },
  {
    path: 'partners',
    name: 'partners-settings',
    component: () => import('./pages/PartnersPge.vue'),
    meta: {
      requiredAccess: 'partners',
    },
  },
  {
    path: 'platform',
    name: 'platform-settings',
    component: () => import('./pages/platform/IndexPage.vue'),
    meta: {
      requireAtLeastOneAccess: ['general_settings', 'social_settings', 'schedule_settings', 'billing_cards'],
    },
    children: [
      {
        path: 'details',
        name: 'platform-settings-details',
        component: () => import('./pages/platform/DetailsPage.vue'),
        meta: {
          requiredAccess: 'general_settings',
        },
      },
      {
        path: 'social-accounts',
        name: 'social-accounts-settings',
        component: () => import('./pages/platform/SocialAccountsPage.vue'),
        meta: {
          requiredAccess: 'social_settings',
        },
      },
      {
        path: 'work-time',
        name: 'work-time-settings',
        component: () => import('./pages/platform/WorkTimePage.vue'),
        meta: {
          requiredAccess: 'schedule_settings',
        },
      },
      {
        path: 'payment-methods',
        name: 'payment-methods-settings',
        component: () => import('./pages/platform/PaymentMethodsPage.vue'),
        meta: {
          requiredAccess: 'billing_cards',
        },
      },
    ],
  },
  {
    path: 'financial-settings',
    name: 'financial-settings',
    component: () => import('./pages/financial-settings/IndexPage.vue'),
    meta: {
      requireAtLeastOneAccess: ['financial_settings', 'payment_commissions', 'point_settings', 'tax_settings'],
    },
    children: [
      {
        path: 'accounts-settings',
        name: 'accounts-settings',
        component: () => import('./pages/financial-settings/AccountsPage.vue'),
        meta: {
          requiredAccess: 'financial_settings',
        },
      },
      {
        path: 'payment-commission',
        name: 'payment-commission-settings',
        component: () => import('./pages/financial-settings/PaymentCommissionPage.vue'),
        meta: {
          requiredAccess: 'payment_commissions',
        },
      },
      {
        path: 'points',
        name: 'points-settings',
        component: () => import('./pages/financial-settings/PointsPage.vue'),
        meta: {
          requiredAccess: 'point_settings',
        },
      },
      {
        path: 'tax',
        name: 'tax-settings',
        component: () => import('./pages/financial-settings/TaxPage.vue'),
        meta: {
          requiredAccess: 'tax_settings',
        },
      },
    ],
  },
  {
    path: 'advertisers-accounts',
    name: 'advertisers-accounts',
    component: () => import('./pages/advertisers-accounts/IndexPage.vue'),
    meta: {
      requireAtLeastOneAccess: ['ads_types', 'discrimination_types', 'account_cases', 'subscription_settings'],
    },
    children: [
      {
        path: 'ads-types',
        name: 'ads-types-settings',
        component: () => import('./pages/advertisers-accounts/AdsTypesPage.vue'),
        meta: {
          requiredAccess: 'ads_types',
        },
      },
      {
        path: 'discrimination-types',
        name: 'discrimination-types-settings',
        component: () => import('./pages/advertisers-accounts/DiscriminationTypesPage.vue'),
        meta: {
          requiredAccess: 'discrimination_types',
        },
      },
      {
        path: 'accounts-cases',
        name: 'accounts-cases-settings',
        component: () => import('./pages/advertisers-accounts/AccountsCasesPage.vue'),
        meta: {
          requiredAccess: 'account_cases',
        },
      },
      {
        path: 'subscription',
        name: 'subscription-settings',
        component: () => import('./pages/advertisers-accounts/SubscriptionPage.vue'),
        meta: {
          requiredAccess: 'subscription_settings',
        },
      },
    ],
  },
]
