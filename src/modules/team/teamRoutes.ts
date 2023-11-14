export const teamRoutes = [
  {
    path: 'employees',
    name: 'employees-page',
    component: () => import('./pages/EmployeesPage.vue'),
    meta: {
      requiredPermission: 'view_admins',
    },
  },
  {
    path: 'employees/create',
    name: 'employees-create-page',
    component: () => import('./pages/EmployeeCreatePage.vue'),
    meta: {
      requiredPermission: 'create_admin',
    },
  },
  {
    path: 'employees/:id/edit',
    name: 'employees-edit-page',
    component: () => import('./pages/EmployeeEditPage.vue'),
    meta: {
      requiredPermission: 'update_admin',
    },
  },
  {
    path: 'employees/:id/details',
    name: 'employees-details-page',
    component: () => import('./pages/EmployeeDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_admin_details',
    },
  },
]
