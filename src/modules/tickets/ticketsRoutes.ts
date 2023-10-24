export const ticketsRoutes = [
  {
    path: 'support-tickets',
    name: 'support-tickets-page',
    component: () => import('./pages/SupportTicketsPage.vue'),
    meta: {
      requiredPermission: 'view_tickets',
    },
  },
  {
    path: 'support-tickets/:id',
    name: 'ticket-details-page',
    component: () => import('./pages/TicketDetailsPage.vue'),
    meta: {
      requiredPermission: 'view_ticket_details',
    },
  },
  {
    path: 'types',
    name: 'tickets-types-page',
    component: () => import('./pages/TypesPage.vue'),
    meta: {
      requiredPermission: 'view_ticket_types',
    },
  },
  {
    path: 'categories',
    name: 'tickets-categories-page',
    component: () => import('./pages/CategoriesPage.vue'),
    meta: {
      requiredPermission: 'view_ticket_categories',
    },
  },
]
