/**
 * Tithes Feature Routes
 * Routes for tithes and offerings management
 */
export default [
  {
    path: '/dashboard/tithes',
    name: 'tithes',
    component: () => import('./TithesView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super-admin', 'admin', 'finance-admin'],
      breadcrumb: 'Tithes & Offerings',
    },
  },
]
