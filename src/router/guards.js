import { useAuthStore } from '@/stores/auth/auth'

/**
 * Navigation guard - handles auth checks
 */
export async function authGuard(to) {
  const authStore = useAuthStore()

  // Initialize auth if we have a token but no user
  if (authStore.token && !authStore.user) {
    await authStore.initializeAuth()
  }

  // Routes requiring authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Routes requiring guest (not logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  // Role-based access
  if (to.meta.roles && to.meta.roles.length > 0) {
    if (!authStore.hasAnyRole(to.meta.roles)) {
      return { name: 'dashboard' }
    }
  }

  return true
}
