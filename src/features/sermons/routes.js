export default [
  {
    path: '/dashboard/sermons',
    name: 'sermons',
    component: () => import('./SermonsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin', 'media-manager'],
      breadcrumb: 'Sermons',
    },
  },
]
