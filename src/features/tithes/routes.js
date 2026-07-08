/**
 * Tithes Feature Routes
 * Routes for tithes and offerings management
 */
export default [
  {
    path: '/dashboard/tithes',
    alias: [
      '/church-admin/dashboard/tithes',
      '/pastor/dashboard/tithes',
      '/member/dashboard/tithes',
      '/visitor/dashboard/tithes',
    ],
    name: 'tithes',
    component: () => import('./TithesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['dashboard.financial', 'transactions.view_all'],
      breadcrumb: 'Tithes & Offerings',
    },
  },
]
