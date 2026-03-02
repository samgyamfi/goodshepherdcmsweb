export default [
  {
    path: '/dashboard/events',
    name: 'events',
    component: () => import('./EventsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin', 'event-manager'],
      breadcrumb: 'Events',
    },
  },
]
