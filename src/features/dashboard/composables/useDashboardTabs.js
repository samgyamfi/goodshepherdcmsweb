import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'

const TAB_STORAGE_KEY = 'dashboard_tab_preference'

/**
 * Dashboard tabs composable
 * Manages tab state and role-based default tab selection
 */
export function useDashboardTabs() {
  const authStore = useAuthStore()

  // Tab state
  const activeTab = ref('personal')

  // Admin roles that should default to admin tab
  const adminRoles = ['super-admin', 'admin']

  /**
   * Check if user is an admin
   */
  const isAdmin = computed(() => {
    return authStore.hasAnyRole(adminRoles)
  })

  /**
   * Get the default tab based on user role
   */
  const getDefaultTab = () => {
    // Check localStorage for saved preference
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
    if (savedTab && ['personal', 'admin'].includes(savedTab)) {
      return savedTab
    }

    // Default based on role
    return isAdmin.value ? 'admin' : 'personal'
  }

  /**
   * Set active tab and persist preference
   */
  const setActiveTab = (tab) => {
    activeTab.value = tab
    localStorage.setItem(TAB_STORAGE_KEY, tab)
  }

  /**
   * Initialize tab state
   */
  const initializeTabs = () => {
    activeTab.value = getDefaultTab()
  }

  // Initialize on mount
  onMounted(() => {
    initializeTabs()
  })

  // Watch for role changes and update default tab if no preference saved
  watch(
    () => authStore.userRoles,
    () => {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
      if (!savedTab) {
        activeTab.value = getDefaultTab()
      }
    },
  )

  return {
    activeTab,
    isAdmin,
    setActiveTab,
    initializeTabs,
  }
}
