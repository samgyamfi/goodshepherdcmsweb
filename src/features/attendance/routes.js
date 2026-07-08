export default [
  {
    path: '/dashboard/attendance',
    alias: [
      '/church-admin/dashboard/attendance',
      '/pastor/dashboard/attendance',
      '/member/dashboard/attendance',
      '/visitor/dashboard/attendance',
    ],
    name: 'attendance',
    component: () => import('./AttendanceView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['events.attendance'],
      breadcrumb: 'Attendance',
    },
  },
]
