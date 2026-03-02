/**
 * Welfare Feature Routes
 * Routes for welfare management
 */
export default [
  {
    path: '/dashboard/welfare',
    name: 'welfare',
    component: () => import('./WelfareView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin', 'welfare-admin'],
      breadcrumb: 'Welfare',
    },
  },
]
