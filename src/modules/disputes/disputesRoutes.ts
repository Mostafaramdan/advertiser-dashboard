export const disputesRoutes = [
  {
    path: 'procedures',
    name: 'disputes-procedures-page',
    component: () => import('./pages/ProceduresPage.vue'),
    meta: {
      requiredPermission: 'view_dispute_replies',
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
