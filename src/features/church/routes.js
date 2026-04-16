export default [
  {
    path: '/dashboard/church/transfers',
    name: 'church-transfers',
    component: () => import('@/features/church/TransferRequestsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Church Transfer Requests',
    },
  },
]
