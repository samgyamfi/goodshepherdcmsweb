export default [
  {
    path: '/dashboard/attendance',
    name: 'attendance',
    component: () => import('./AttendanceView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin', 'attendance-manager'],
      breadcrumb: 'Attendance',
    },
  },
]
