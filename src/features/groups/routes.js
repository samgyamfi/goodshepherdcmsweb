const workspaceChildren = [
  {
    path: '',
    name: 'group-wall',
    component: () => import('./views/GroupWallView.vue'),
    meta: { breadcrumb: 'Wall' },
  },
  {
    path: 'dashboard',
    name: 'group-dashboard',
    component: () => import('./views/GroupDashboardView.vue'),
    meta: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'personal',
    name: 'group-personal',
    component: () => import('./views/GroupPersonalView.vue'),
    meta: { breadcrumb: 'My Space' },
  },
  {
    path: 'schedule',
    name: 'group-schedule',
    component: () => import('./views/GroupScheduleView.vue'),
    meta: { breadcrumb: 'Schedule' },
  },
  {
    path: 'events',
    name: 'group-events',
    component: () => import('./views/GroupEventsView.vue'),
    meta: { breadcrumb: 'Events' },
  },
  {
    path: 'members',
    name: 'group-members',
    component: () => import('./views/GroupMembersView.vue'),
    meta: { breadcrumb: 'Members' },
  },
  {
    path: 'announcements',
    name: 'group-announcements',
    component: () => import('./views/GroupAnnouncementsView.vue'),
    meta: { breadcrumb: 'Announcements' },
  },
  {
    path: 'minutes',
    name: 'group-minutes',
    component: () => import('./views/GroupMinutesView.vue'),
    meta: { breadcrumb: 'Minutes' },
  },
  {
    path: 'notices',
    name: 'group-notices',
    component: () => import('./views/GroupNoticesView.vue'),
    meta: { breadcrumb: 'Notices' },
  },
  {
    path: 'branding',
    name: 'group-branding',
    component: () => import('./views/GroupBrandingView.vue'),
    meta: { breadcrumb: 'Branding' },
  },
  {
    path: 'settings',
    name: 'group-settings',
    component: () => import('./views/GroupSettingsView.vue'),
    meta: { breadcrumb: 'Settings' },
  },
]

export default [
  {
    path: '/dashboard/groups',
    alias: [
      '/church-admin/dashboard/groups',
      '/pastor/dashboard/groups',
      '/member/dashboard/groups',
      '/visitor/dashboard/groups',
    ],
    name: 'groups',
    component: () => import('./GroupsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['groups.view'],
      breadcrumb: 'Groups',
    },
  },
  {
    path: '/dashboard/groups/:uuid',
    alias: [
      '/church-admin/dashboard/groups/:uuid',
      '/pastor/dashboard/groups/:uuid',
      '/member/dashboard/groups/:uuid',
    ],
    component: () => import('./GroupWorkspaceView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['groups.view'],
      breadcrumb: 'Group',
    },
    children: workspaceChildren,
  },
]
