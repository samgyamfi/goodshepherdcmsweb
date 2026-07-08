/**
 * Welfare Feature Routes
 * Routes for welfare management
 */
export default [
  {
    path: '/dashboard/welfare',
    alias: [
      '/church-admin/dashboard/welfare',
      '/pastor/dashboard/welfare',
      '/member/dashboard/welfare',
      '/visitor/dashboard/welfare',
    ],
    name: 'welfare',
    component: () => import('./WelfareView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['welfare.payments.view'],
      breadcrumb: 'Welfare',
    },
  },
]
