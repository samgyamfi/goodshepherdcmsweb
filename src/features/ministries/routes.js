export default [
  {
    path: '/dashboard/ministries',
    name: 'ministries',
    component: () => import('./MinistriesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Ministries',
    },
  },
]
