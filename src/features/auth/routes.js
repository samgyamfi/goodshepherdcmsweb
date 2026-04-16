/**
 * Auth Feature Routes
 * Guest-only routes for authentication + authenticated holding pages.
 */
export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true },
  },
  /**
   * Authenticated users with no active church profile land here after login.
   * `allowWithoutChurch` tells the global guard not to bounce them away.
   */
  {
    path: '/account/no-church',
    name: 'no-church',
    component: () => import('./views/NoChurchView.vue'),
    meta: { requiresAuth: true, allowWithoutChurch: true },
  },
]
