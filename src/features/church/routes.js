export default [
  {
    path: '/dashboard/church/transfers',
    alias: [
      '/church-admin/dashboard/church/transfers',
      '/pastor/dashboard/church/transfers',
      '/member/dashboard/church/transfers',
      '/visitor/dashboard/church/transfers',
    ],
    name: 'church-transfers',
    component: () => import('@/features/church/TransferRequestsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Church Transfer Requests',
    },
  },
]
