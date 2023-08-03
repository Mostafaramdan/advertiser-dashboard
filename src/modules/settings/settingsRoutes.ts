export const settingsRoutes = [
  {
    path: 'entities',
    name: 'entities-settings',
    component: () => import('./pages/EntitiesPage.vue'),
    meta: {
      accessPage: 'Entity',
    },
  },
]
