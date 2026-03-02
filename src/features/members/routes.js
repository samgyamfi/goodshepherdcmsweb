/**
 * Members Feature Routes
 * Routes for member management
 */
export default [
  {
    path: '/dashboard/members',
    name: 'members',
    component: () => import('./MembersView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super_admin', 'admin', 'secretary', 'member_leader'],
      breadcrumb: 'Members',
    },
  },
  {
    path: '/dashboard/members/new',
    name: 'members-new',
    component: () => import('./MembersView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super_admin', 'admin', 'secretary'],
      breadcrumb: 'New Member',
      parent: 'members',
    },
  },
  {
    path: '/dashboard/members/:id/edit',
    name: 'members-edit',
    component: () => import('./MembersView.vue'),
    meta: {
      requiresAuth: true,
      // roles: ['super_admin', 'admin', 'secretary'],
      breadcrumb: 'Edit Member',
      parent: 'members',
    },
    props: true,
  },
]
