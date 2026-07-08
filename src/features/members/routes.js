/**
 * Members Feature Routes
 * Routes for member management
 */
export default [
  {
    path: '/dashboard/members',
    alias: [
      '/church-admin/dashboard/members',
      '/pastor/dashboard/members',
      '/member/dashboard/members',
      '/visitor/dashboard/members',
    ],
    name: 'members',
    component: () => import('./MembersView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['members.view_all'],
      breadcrumb: 'Members',
    },
  },
  {
    path: '/dashboard/members/new',
    alias: [
      '/church-admin/dashboard/members/new',
      '/pastor/dashboard/members/new',
      '/member/dashboard/members/new',
      '/visitor/dashboard/members/new',
    ],
    name: 'members-new',
    component: () => import('./MemberForm.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['members.create'],
      breadcrumb: 'New Member',
      parent: 'members',
    },
  },
  {
    path: '/dashboard/members/:id/edit',
    alias: [
      '/church-admin/dashboard/members/:id/edit',
      '/pastor/dashboard/members/:id/edit',
      '/member/dashboard/members/:id/edit',
      '/visitor/dashboard/members/:id/edit',
    ],
    name: 'members-edit',
    component: () => import('./MemberForm.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['members.update'],
      breadcrumb: 'Edit Member',
      parent: 'members',
    },
    props: true,
  },
  {
    path: '/dashboard/members/:id/details',
    alias: [
      '/church-admin/dashboard/members/:id/details',
      '/pastor/dashboard/members/:id/details',
      '/member/dashboard/members/:id/details',
      '/visitor/dashboard/members/:id/details',
    ],
    name: 'members-details',
    component: () => import('./MemberDetails.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['members.view_all'],
      breadcrumb: 'Member Details',
      parent: 'members',
    },
    props: true,
  },
]
