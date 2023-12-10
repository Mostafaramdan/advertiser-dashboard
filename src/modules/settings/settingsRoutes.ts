export const settingsRoutes = [
  {
    path: 'countries',
    name: 'countries-settings',
    component: () => import('./pages/CountriesPage.vue'),
    meta: {
      requiredPermission: 'view_countries',
    },
  },
  {
    path: 'countries/:id/areas',
    name: 'areas-settings',
    component: () => import('./pages/AreasPage.vue'),
    meta: {
      requiredPermission: 'view_areas',
    },
  },
  {
    path: 'entities',
    name: 'entities-settings',
    component: () => import('./pages/EntitiesPage.vue'),
    meta: {
      requiredPermission: 'view_entities',
    },
  },
  {
    path: 'tags',
    name: 'tags-settings',
    component: () => import('./pages/TagsPage.vue'),
    meta: {
      requiredPermission: 'view_tags',
    },
  },
  {
    path: 'categories',
    name: 'categories-settings',
    component: () => import('./pages/CategoriesPage.vue'),
    meta: {
      requiredPermission: 'view_categories',
    },
  },
  {
    path: 'ads-settings',
    name: 'ads-settings',
    component: () => import('./pages/AdsSettingsPage.vue'),
    meta: {
      requiredPermission: 'view_ads_settings',
    },
  },
  {
    path: 'channels',
    name: 'channels-settings',
    component: () => import('./pages/ChannelsPage.vue'),
    meta: {
      requiredPermission: 'view_channels',
    },
  },
  {
    path: 'reports-reasons',
    name: 'reports-reasons-settings',
    component: () => import('./pages/ReportsReasons.vue'),
    meta: {
      requiredPermission: 'view_report_reasons',
    },
  },
  {
    path: 'questions',
    name: 'questions-settings',
    component: () => import('./pages/QuestionsPage.vue'),
    meta: {
      requiredPermission: 'view_questions',
    },
  },
  {
    path: 'rating-items',
    name: 'rating-items-settings',
    component: () => import('./pages/RateItemsPage.vue'),
    meta: {
      requiredPermission: 'view_rate_types',
    },
  },
  {
    path: 'terms-and-conditions',
    name: 'terms-conditions-settings',
    component: () => import('./pages/TermsConditionsPage.vue'),
    meta: {
      requiredPermission: 'view_terms',
    },
  },
  {
    path: 'subscription-extra-points',
    name: 'subscription-extra-points-settings',
    component: () => import('./pages/SubscriptionExtraPointsPage.vue'),
    meta: {
      requiredPermission: 'view_subscription_extra_points',
    },
  },
  {
    path: 'platform-news',
    name: 'platform-news-settings',
    component: () => import('./pages/PlatformNewsPage.vue'),
    meta: {
      requiredPermission: 'view_page_news',
    },
  },
  {
    path: 'partners',
    name: 'partners-settings',
    component: () => import('./pages/PartnersPage.vue'),
    meta: {
      requiredPermission: 'view_partners',
    },
  },
  {
    path: 'videos',
    name: 'videos-settings',
    component: () => import('./pages/VideosPage.vue'),
    meta: {
      requiredPermission: 'view_videos',
    },
  },
  {
    path: 'about-us',
    name: 'about-us-settings',
    component: () => import('./pages/AboutUsPage.vue'),
    meta: {
      requiredPermission: 'view_abouts',
    },
  },
  {
    path: 'tickets',
    name: 'tickets-settings',
    component: () => import('./pages/TicketsPage.vue'),
    meta: {
      requiredPermission: 'view_ticket_settings',
    },
  },
  {
    path: 'chat',
    name: 'chat-settings',
    component: () => import('./pages/ChatPage.vue'),
    meta: {
      requiredPermission: 'view_chat_settings',
    },
  },
  {
    path: 'ready-replies',
    name: 'ready-replies-settings',
    component: () => import('./pages/ReadyRepliesPage.vue'),
    meta: {
      requiredPermission: 'view_admin_replies',
    },
  },
  {
    path: 'budget-slides',
    name: 'budget-slides-settings',
    component: () => import('./pages/BudgetSlidesPage.vue'),
    meta: {
      requiredPermission: 'view_budget_slides',
    },
  },
  {
    path: 'platform',
    name: 'platform-settings',
    component: () => import('./pages/platform/IndexPage.vue'),
    meta: {
      requireAtLeastOnePermission: [
        'view_general_settings',
        'view_social_settings',
        'view_schedule_settings',
        'view_billing_cards',
      ],
    },
    children: [
      {
        path: 'details',
        name: 'platform-settings-details',
        component: () => import('./pages/platform/DetailsPage.vue'),
        meta: {
          requiredPermission: 'view_general_settings',
        },
      },
      {
        path: 'social-accounts',
        name: 'social-accounts-settings',
        component: () => import('./pages/platform/SocialAccountsPage.vue'),
        meta: {
          requiredPermission: 'view_social_settings',
        },
      },
      {
        path: 'work-time',
        name: 'work-time-settings',
        component: () => import('./pages/platform/WorkTimePage.vue'),
        meta: {
          requiredPermission: 'view_schedule_settings',
        },
      },
      {
        path: 'payment-methods',
        name: 'payment-methods-settings',
        component: () => import('./pages/platform/PaymentMethodsPage.vue'),
        meta: {
          requiredPermission: 'view_billing_cards',
        },
      },
    ],
  },
  {
    path: 'financial-settings',
    name: 'financial-settings',
    component: () => import('./pages/financial-settings/IndexPage.vue'),
    meta: {
      requireAtLeastOnePermission: [
        'view_financial_settings',
        'view_payment_commissions',
        'view_point_settings',
        'view_tax_settings',
      ],
    },
    children: [
      {
        path: 'accounts-settings',
        name: 'accounts-settings',
        component: () => import('./pages/financial-settings/AccountsPage.vue'),
        meta: {
          requiredPermission: 'view_financial_settings',
        },
      },
      {
        path: 'payment-commission',
        name: 'payment-commission-settings',
        component: () => import('./pages/financial-settings/PaymentCommissionPage.vue'),
        meta: {
          requiredPermission: 'view_payment_commissions',
        },
      },
      {
        path: 'points',
        name: 'points-settings',
        component: () => import('./pages/financial-settings/PointsPage.vue'),
        meta: {
          requiredPermission: 'view_point_settings',
        },
      },
      {
        path: 'tax',
        name: 'tax-settings',
        component: () => import('./pages/financial-settings/TaxPage.vue'),
        meta: {
          requiredPermission: 'view_tax_settings',
        },
      },
    ],
  },
  {
    path: 'advertisers-accounts',
    name: 'advertisers-accounts',
    component: () => import('./pages/advertisers-accounts/IndexPage.vue'),
    meta: {
      requireAtLeastOnePermission: [
        'view_ads_types',
        'view_discrimination_types',
        'view_account_cases',
        'view_subscription_settings',
      ],
    },
    children: [
      {
        path: 'ads-types',
        name: 'ads-types-settings',
        component: () => import('./pages/advertisers-accounts/AdsTypesPage.vue'),
        meta: {
          requiredPermission: 'view_ads_types',
        },
      },
      {
        path: 'discrimination-types',
        name: 'discrimination-types-settings',
        component: () => import('./pages/advertisers-accounts/DiscriminationTypesPage.vue'),
        meta: {
          requiredPermission: 'view_discrimination_types',
        },
      },
      {
        path: 'accounts-cases',
        name: 'accounts-cases-settings',
        component: () => import('./pages/advertisers-accounts/AccountsCasesPage.vue'),
        meta: {
          requiredPermission: 'view_account_cases',
        },
      },
      {
        path: 'subscription',
        name: 'subscription-settings',
        component: () => import('./pages/advertisers-accounts/SubscriptionPage.vue'),
        meta: {
          requiredPermission: 'view_subscription_settings',
        },
      },
    ],
  },
]
