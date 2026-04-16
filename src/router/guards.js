import { useAuthStore } from '@/stores/auth/auth'
import { useChurchStore } from '@/stores/church'

/**
 * Resolve the correct landing route for an already-authenticated user
 * hitting a guest-only route (login, forgot-password).
 *
 *   super_admin  + no church context  → /admin
 *   super_admin  + has church context → /dashboard
 *   other user   + has church context → /dashboard
 *   other user   + no church context  → /account/no-church
 */
function resolveHome(authStore, churchStore) {
  if (authStore.isSuperAdmin && !churchStore.church) {
    return { name: 'admin-dashboard' }
  }
  if (!authStore.isSuperAdmin && !churchStore.church) {
    return { name: 'no-church' }
  }
  return { name: 'dashboard' }
}

/**
 * Global navigation guard.
 */
export async function authGuard(to) {
  const authStore   = useAuthStore()
  const churchStore = useChurchStore()

  // ── 1. Hydrate on hard refresh ────────────────────────────────────────────
  if (authStore.token && !authStore.user) {
    await authStore.initializeAuth()
  }

  // ── 2. Unauthenticated → protected route ──────────────────────────────────
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // ── 2b. no-church route: must be authenticated; bounce if church exists ───
  if (to.name === 'no-church') {
    if (!authStore.isAuthenticated) {
      return { name: 'login' }
    }
    // User now has an active church — leave the holding page
    if (authStore.hasActiveChurch || churchStore.church) {
      return { name: 'dashboard' }
    }
    // Super admins without church belong on the system dashboard, not here
    if (authStore.isSuperAdmin) {
      return { name: 'admin-dashboard' }
    }
    return true
  }

  // ── 3. Authenticated → guest-only route ───────────────────────────────────
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return resolveHome(authStore, churchStore)
  }

  // ── 4. Super-admin-only routes ────────────────────────────────────────────
  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    return { name: 'dashboard' }
  }

  // ── 5. Spatie role-based access ───────────────────────────────────────────
  if (to.meta.roles?.length > 0 && !authStore.hasAnyRole(to.meta.roles)) {
    return resolveHome(authStore, churchStore)
  }

  // ── 6. Church context for /dashboard/** ───────────────────────────────────
  // Routes that explicitly allow access without a church skip this check.
  if (
    authStore.isAuthenticated
    && to.path.startsWith('/dashboard')
    && !to.meta.allowWithoutChurch
  ) {
    if (!churchStore.church) {
      if (authStore.isSuperAdmin) {
        return { name: 'admin-dashboard' }
      }
      return { name: 'no-church' }
    }
  }

  return true
}
