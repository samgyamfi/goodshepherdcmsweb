export default [
  {
    path: '/dashboard/audit-logs',
    alias: [
      '/church-admin/dashboard/audit-logs',
      '/pastor/dashboard/audit-logs',
      '/member/dashboard/audit-logs',
      '/visitor/dashboard/audit-logs',
    ],
    name: 'church-audit-logs',
    component: () => import('./AuditLogsView.vue'),
    meta: { requiresAuth: true, permissions: ['audit.view'], breadcrumb: 'Audit Logs' },
  },
]
