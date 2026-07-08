export default [
  {
    path: '/dashboard/sermons',
    alias: [
      '/church-admin/dashboard/sermons',
      '/pastor/dashboard/sermons',
      '/member/dashboard/sermons',
      '/visitor/dashboard/sermons',
    ],
    name: 'sermons',
    component: () => import('./SermonsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Sermons',
    },
  },
]
