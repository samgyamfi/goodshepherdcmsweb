export default [
  {
    path: '/dashboard/groups',
    alias: [
      '/church-admin/dashboard/groups',
      '/pastor/dashboard/groups',
      '/member/dashboard/groups',
      '/visitor/dashboard/groups',
    ],
    name: 'groups',
    component: () => import('./GroupsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['groups.view'],
      breadcrumb: 'Small Groups',
    },
  },
]
