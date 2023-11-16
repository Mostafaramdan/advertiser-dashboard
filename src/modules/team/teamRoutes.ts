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
  {
    path: 'categories',
    name: 'team-categories-page',
    component: () => import('./pages/CategoriesPage.vue'),
    meta: {
      requiredPermission: 'view_role_categories',
    },
  },
  {
    path: 'roles',
    name: 'team-roles-page',
    component: () => import('./pages/RolesPage.vue'),
    meta: {
      requiredPermission: 'view_roles',
    },
  },
  {
    path: 'roles/:id/details',
    name: 'roles-details-page',
    component: () => import('./pages/RoleDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_role_details',
    },
  },
  {
    path: 'roles/create',
    name: 'roles-create-page',
    component: () => import('./pages/RoleCreatePage.vue'),
    meta: {
      requiredPermission: 'create_role',
    },
  },
  {
    path: 'roles/:id/edit',
    name: 'roles-edit-page',
    component: () => import('./pages/RoleEditPage.vue'),
    meta: {
      requiredPermission: 'update_role',
    },
  },
]
