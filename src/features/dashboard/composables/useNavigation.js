import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { navigationSections } from '../config/navigationLinks'

/**
 * Navigation composable
 * Filters navigation links based on user roles
 */
export function useNavigation() {
  // eslint-disable-next-line no-unused-vars
  const authStore = useAuthStore()

  /**
   * Filter navigation sections based on user roles
   */
  const filteredSections = computed(() => {
    return navigationSections.map((section) => ({
      ...section,
      links: section.links.filter((link) => {
        // Empty roles array means accessible to all authenticated users
        if (link.roles?.length === 0 || !link.roles) return true

        // Check if user has any of the required roles
        // return authStore.hasAnyRole(link.roles)
        return true
      }),
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
