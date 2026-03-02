export default [
  {
    path: '/dashboard/groups',
    name: 'groups',
    component: () => import('./GroupsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin', 'group-leader'],
      breadcrumb: 'Small Groups',
    },
  },
]
