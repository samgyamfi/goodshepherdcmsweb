import { useAuthStore } from '@/stores/auth/auth'
import { useChurchStore } from '@/stores/church'
import { requiresChurchContext } from '@/utils/dashboardRoutes'

function resolveHome(authStore, churchStore) {
  if (authStore.isSuperAdmin && !churchStore.church) {
    return { name: authStore.dashboardRouteName }
  }

  if (!authStore.isSuperAdmin && !churchStore.church) {
    return { name: 'no-church' }
  }

  return { name: authStore.dashboardRouteName }
}

export async function authGuard(to) {
  const authStore = useAuthStore()
  const churchStore = useChurchStore()

  if (authStore.token && !authStore.user) {
    await authStore.initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (
    authStore.isAuthenticated
    && authStore.mustChangePassword
    && to.name !== 'set-initial-password'
  ) {
    return { name: 'set-initial-password' }
  }

  if (
    to.name === 'set-initial-password'
    && authStore.isAuthenticated
    && !authStore.mustChangePassword
  ) {
    return resolveHome(authStore, churchStore)
  }

  if (to.name === 'no-church') {
    if (!authStore.isAuthenticated) {
      return { name: 'login' }
    }

    if (authStore.hasActiveChurch || churchStore.church) {
      return { name: authStore.dashboardRouteName }
    }

    if (authStore.isSuperAdmin) {
      return { name: authStore.dashboardRouteName }
    }

    return true
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return resolveHome(authStore, churchStore)
  }

  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    return resolveHome(authStore, churchStore)
  }

  if (to.meta.userTypes?.length > 0 && !to.meta.userTypes.includes(authStore.user?.user_type)) {
    return resolveHome(authStore, churchStore)
  }

  if (to.meta.permissions?.length > 0 && !authStore.canAny(to.meta.permissions)) {
    return resolveHome(authStore, churchStore)
  }

  if (
    authStore.isAuthenticated
    && requiresChurchContext(to.path)
    && !to.meta.allowWithoutChurch
  ) {
    if (!churchStore.church) {
      if (authStore.isSuperAdmin) {
        return { name: authStore.dashboardRouteName }
      }

      return { name: 'no-church' }
    }
  }

  return true
}
