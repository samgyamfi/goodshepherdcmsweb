import { UserType } from '@/enums'

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/church-admin/dashboard',
    name: 'church-admin-dashboard',
    component: () => import('./DashboardView.vue'),
    meta: {
      requiresAuth: true,
      userTypes: [UserType.CHURCH_ADMIN],
      breadcrumb: 'Dashboard',
    },
  },
  {
    path: '/pastor/dashboard',
    name: 'pastor-dashboard',
    component: () => import('./DashboardView.vue'),
    meta: {
      requiresAuth: true,
      userTypes: [UserType.PASTOR],
      breadcrumb: 'Dashboard',
    },
  },
  {
    path: '/member/dashboard',
    name: 'member-dashboard',
    component: () => import('./DashboardView.vue'),
    meta: {
      requiresAuth: true,
      userTypes: [UserType.MEMBER],
      breadcrumb: 'Dashboard',
    },
  },
  {
    path: '/visitor/dashboard',
    name: 'visitor-dashboard',
    component: () => import('./DashboardView.vue'),
    meta: {
      requiresAuth: true,
      userTypes: [UserType.VISITOR],
      breadcrumb: 'Dashboard',
    },
  },
]
