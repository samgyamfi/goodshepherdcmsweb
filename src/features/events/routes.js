export default [
  {
    path: '/dashboard/events',
    alias: [
      '/church-admin/dashboard/events',
      '/pastor/dashboard/events',
      '/member/dashboard/events',
      '/visitor/dashboard/events',
    ],
    name: 'events',
    component: () => import('./EventsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['events.view'],
      breadcrumb: 'Events',
    },
  },
]
