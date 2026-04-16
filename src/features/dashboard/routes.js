export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./DashboardView.vue'),
    meta: { requiresAuth: true },
  },
]
