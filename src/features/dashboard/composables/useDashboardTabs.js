import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { UserType } from '@/enums'

const TAB_STORAGE_KEY = 'dashboard_tab_preference'

/**
 * Dashboard tabs composable.
 *
 * - "My Dashboard" (personal)  → visible to all authenticated users
 * - "Church Dashboard" (admin) → visible to super_admin and church_admin only
 *
 * Visibility is driven by UserType.canSeeChurchDashboard() rather than
 * string literals, keeping the rule in one place alongside the enum.
 */
export function useDashboardTabs() {
  const authStore = useAuthStore()

  const activeTab = ref('personal')

  /**
   * Whether the current user can see the Church Dashboard tab.
   * Delegates entirely to the UserType enum — no raw strings here.
   */
  const canSeeChurchTab = computed(() =>
    UserType.canSeeChurchDashboard(authStore.user?.user_type),
  )

  function getDefaultTab() {
    const saved = localStorage.getItem(TAB_STORAGE_KEY)

    // Only restore the saved tab if the user is still allowed to see it
    if (saved === 'admin' && !canSeeChurchTab.value) return 'personal'

    if (saved && ['personal', 'admin'].includes(saved)) return saved

    // First-visit default: admins land on church overview, everyone else on personal
    return canSeeChurchTab.value ? 'admin' : 'personal'
  }

  function setActiveTab(tab) {
    activeTab.value = tab
    localStorage.setItem(TAB_STORAGE_KEY, tab)
  }

  function initializeTabs() {
    activeTab.value = getDefaultTab()
  }

  onMounted(initializeTabs)

  // Re-evaluate when the user object resolves (e.g. after initializeAuth)
  watch(
    () => authStore.user?.user_type,
    () => {
      if (activeTab.value === 'admin' && !canSeeChurchTab.value) {
        setActiveTab('personal')
      }
    },
  )

  return {
    activeTab,
    canSeeChurchTab,
    setActiveTab,
    initializeTabs,
  }
}
