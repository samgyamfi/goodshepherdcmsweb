/**
 * Super-admin routes — all nested under the AdminLayout shell.
 * The parent route renders AdminLayout (with RouterView).
 * Each child renders its own view component inside that shell.
 */
export default [
  {
    path: '/super-admin',
    component: () => import('./components/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
    redirect: { name: 'super-admin-dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'super-admin-dashboard',
        component: () => import('./dashboard/AdminDashboardView.vue'),
        meta: { breadcrumb: 'Super Admin' },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('./components/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('./dashboard/AdminDashboardView.vue'),
        meta: { breadcrumb: 'Admin' },
      },
      {
        path: 'churches',
        name: 'admin-churches',
        component: () => import('./churches/views/AdminChurchesView.vue'),
        meta: { breadcrumb: 'Churches' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('./users/views/AdminUsersView.vue'),
        meta: { breadcrumb: 'Users' },
      },
      {
        path: 'transfers',
        name: 'admin-transfers',
        component: () => import('./transfers/views/AdminTransfersView.vue'),
        meta: { breadcrumb: 'Transfer Requests' },
      },
      {
        path: 'roles',
        name: 'admin-roles',
        component: () => import('./roles/views/AdminRolesView.vue'),
        meta: { breadcrumb: 'Roles & Permissions' },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('./settings/views/AdminSystemSettingsView.vue'),
        meta: { breadcrumb: 'System Settings' },
      },
    ],
  },
]
