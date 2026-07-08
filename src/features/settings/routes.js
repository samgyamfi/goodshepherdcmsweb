/**
 * Settings Feature Routes
 * Routes for system settings and configuration
 */
export default [
  {
    path: '/dashboard/settings',
    alias: [
      '/church-admin/dashboard/settings',
      '/pastor/dashboard/settings',
      '/member/dashboard/settings',
      '/visitor/dashboard/settings',
    ],
    name: 'settings',
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Settings',
    },
  },
  {
    path: '/dashboard/settings/roles',
    alias: [
      '/church-admin/dashboard/settings/roles',
      '/pastor/dashboard/settings/roles',
      '/member/dashboard/settings/roles',
      '/visitor/dashboard/settings/roles',
    ],
    name: 'settings-roles',
    component: () => import('./views/SettingsRolesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['roles.view'],
      breadcrumb: 'Roles & Permissions',
    },
  },
  {
    path: '/dashboard/settings/transaction-types',
    alias: [
      '/church-admin/dashboard/settings/transaction-types',
      '/pastor/dashboard/settings/transaction-types',
      '/member/dashboard/settings/transaction-types',
      '/visitor/dashboard/settings/transaction-types',
    ],
    name: 'settings-transaction-types',
    component: () => import('./views/SettingsTransactionTypesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Transaction Types',
    },
  },
  {
    path: '/dashboard/settings/ministries',
    alias: [
      '/church-admin/dashboard/settings/ministries',
      '/pastor/dashboard/settings/ministries',
      '/member/dashboard/settings/ministries',
      '/visitor/dashboard/settings/ministries',
    ],
    name: 'settings-ministries',
    component: () => import('./views/SettingsMinistriesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Ministries',
    },
  },
  {
    path: '/dashboard/settings/categories',
    alias: [
      '/church-admin/dashboard/settings/categories',
      '/pastor/dashboard/settings/categories',
      '/member/dashboard/settings/categories',
      '/visitor/dashboard/settings/categories',
    ],
    name: 'settings-categories',
    component: () => import('./views/SettingsCategoriesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Case Categories',
    },
  },
  {
    path: '/dashboard/settings/countries',
    alias: [
      '/church-admin/dashboard/settings/countries',
      '/pastor/dashboard/settings/countries',
      '/member/dashboard/settings/countries',
      '/visitor/dashboard/settings/countries',
    ],
    name: 'settings-countries',
    component: () => import('./views/SettingsCountriesView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Countries & Languages',
    },
  },
  {
    path: '/dashboard/settings/groups',
    alias: [
      '/church-admin/dashboard/settings/groups',
      '/pastor/dashboard/settings/groups',
      '/member/dashboard/settings/groups',
      '/visitor/dashboard/settings/groups',
    ],
    name: 'settings-groups',
    component: () => import('./views/SettingsGroupsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.view'],
      breadcrumb: 'Groups',
    },
  },
  {
    path: '/dashboard/settings/content-management',
    alias: [
      '/church-admin/dashboard/settings/content-management',
      '/pastor/dashboard/settings/content-management',
      '/member/dashboard/settings/content-management',
      '/visitor/dashboard/settings/content-management',
    ],
    name: 'settings-content-management',
    component: () => import('./views/SettingsContentManagementView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.update'],
      breadcrumb: 'Content Management',
    },
  },
  {
    path: '/dashboard/settings/pastors',
    alias: [
      '/church-admin/dashboard/settings/pastors',
      '/pastor/dashboard/settings/pastors',
      '/member/dashboard/settings/pastors',
      '/visitor/dashboard/settings/pastors',
    ],
    name: 'settings-pastors',
    component: () => import('./views/SettingsPastorsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.update'],
      breadcrumb: 'Pastors Management',
    },
  },
  {
    path: '/dashboard/settings/programs',
    alias: [
      '/church-admin/dashboard/settings/programs',
      '/pastor/dashboard/settings/programs',
      '/member/dashboard/settings/programs',
      '/visitor/dashboard/settings/programs',
    ],
    name: 'settings-programs',
    component: () => import('./views/SettingsProgramsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['settings.update'],
      breadcrumb: 'Programs Management',
    },
  },
  {
    path: '/dashboard/settings/events',
    alias: [
      '/church-admin/dashboard/settings/events',
      '/pastor/dashboard/settings/events',
      '/member/dashboard/settings/events',
      '/visitor/dashboard/settings/events',
    ],
    name: 'settings-events',
    component: () => import('./views/SettingsEventsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['events.update'],
      breadcrumb: 'Events Management',
    },
  },
]
