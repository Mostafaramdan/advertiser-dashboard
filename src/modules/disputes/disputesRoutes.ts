export const disputesRoutes = [
  {
    path: 'requests',
    name: 'disputes-requests-page',
    component: () => import('./pages/RequestsPage.vue'),
    meta: {
      requiredPermission: 'view_disputes',
    },
  },
  {
    path: 'procedures',
    name: 'disputes-procedures-page',
    component: () => import('./pages/ProceduresPage.vue'),
    meta: {
      requiredPermission: 'view_dispute_procedures',
    },
  },
  {
    path: 'types',
    name: 'disputes-types-page',
    component: () => import('./pages/TypesPage.vue'),
    meta: {
      requiredPermission: 'view_dispute_types',
    },
  },
]
