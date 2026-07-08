import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { navigationSections } from '../config/navigationLinks'
import { typedDashboardPath } from '@/utils/dashboardRoutes'

/**
 * Navigation composable
 * Filters navigation links based on Spatie permissions
 */
export function useNavigation() {
  const authStore = useAuthStore()
  const route = useRoute()

  function pathForCurrentShell(path) {
    if (authStore.isSuperAdmin && route.path.startsWith('/dashboard')) {
      return path
    }

    return typedDashboardPath(authStore.user?.user_type, path)
  }

  /**
   * Filter navigation sections based on user roles
   */
  const filteredSections = computed(() => {
    return navigationSections.map((section) => ({
      ...section,
      links: section.links.filter((link) => {
        if (link.permissions?.length === 0 || !link.permissions) return true

        return authStore.canAny(link.permissions)
      }).map((link) => ({
        ...link,
        path: pathForCurrentShell(link.path),
      })),
    }))
  })

  /**
   * Get all visible navigation links (flat list)
   */
  const visibleLinks = computed(() => {
    return filteredSections.value.flatMap((section) => section.links)
  })

  return {
    navigationSections: filteredSections,
    visibleLinks,
  }
}
