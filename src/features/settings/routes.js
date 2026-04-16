/**
 * Settings Feature Routes
 * Routes for system settings and configuration
 */
export default [
  {
    path: '/dashboard/settings',
    name: 'settings',
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Settings',
    },
  },
  {
    path: '/dashboard/settings/roles',
    name: 'settings-roles',
    component: () => import('./views/SettingsRolesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Roles & Permissions',
    },
  },
  {
    path: '/dashboard/settings/transaction-types',
    name: 'settings-transaction-types',
    component: () => import('./views/SettingsTransactionTypesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Transaction Types',
    },
  },
  {
    path: '/dashboard/settings/ministries',
    name: 'settings-ministries',
    component: () => import('./views/SettingsMinistriesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Ministries',
    },
  },
  {
    path: '/dashboard/settings/categories',
    name: 'settings-categories',
    component: () => import('./views/SettingsCategoriesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Case Categories',
    },
  },
  {
    path: '/dashboard/settings/countries',
    name: 'settings-countries',
    component: () => import('./views/SettingsCountriesView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Countries & Languages',
    },
  },
  {
    path: '/dashboard/settings/groups',
    name: 'settings-groups',
    component: () => import('./views/SettingsGroupsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'admin'],
      breadcrumb: 'Groups',
    },
  },
  {
    path: '/dashboard/settings/content-management',
    name: 'settings-content-management',
    component: () => import('./views/SettingsContentManagementView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'church-admin'],
      breadcrumb: 'Content Management',
    },
  },
  {
    path: '/dashboard/settings/pastors',
    name: 'settings-pastors',
    component: () => import('./views/SettingsPastorsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'church-admin'],
      breadcrumb: 'Pastors Management',
    },
  },
  {
    path: '/dashboard/settings/programs',
    name: 'settings-programs',
    component: () => import('./views/SettingsProgramsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'church-admin'],
      breadcrumb: 'Programs Management',
    },
  },
  {
    path: '/dashboard/settings/events',
    name: 'settings-events',
    component: () => import('./views/SettingsEventsView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super-admin', 'church-admin'],
      breadcrumb: 'Events Management',
    },
  },
]
