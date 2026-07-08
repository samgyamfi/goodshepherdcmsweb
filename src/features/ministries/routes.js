export default [
  {
    path: '/dashboard/ministries',
    alias: [
      '/church-admin/dashboard/ministries',
      '/pastor/dashboard/ministries',
      '/member/dashboard/ministries',
      '/visitor/dashboard/ministries',
    ],
    name: 'ministries',
    component: () => import('./MinistriesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['groups.view'],
      breadcrumb: 'Ministries',
    },
  },
]
