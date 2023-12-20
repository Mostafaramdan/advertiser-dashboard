export const pointsRoutes = [
  {
    path: 'logs',
    name: 'points-logs-page',
    component: () => import('./pages/PointsLogsPage.vue'),
    meta: {
      requiredPermission: 'view_points_logs',
    },
  },
  {
    path: 'users-points',
    name: 'users-points-page',
    component: () => import('./pages/UsersPointsPage.vue'),
    meta: {
      requiredPermission: 'view_users_points',
    },
  },
]
