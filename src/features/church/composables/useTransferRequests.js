import { computed } from 'vue'
import { useTransferRequestsStore } from '@/stores/transferRequests'
import { useAuthStore } from '@/stores/auth/auth'
import { UserType } from '@/enums'

/**
 * Composable for managing church transfer requests.
 * Uses the transfer requests store for state management.
 */
export function useTransferRequests() {
  const transferStore = useTransferRequestsStore()
  const authStore = useAuthStore()

  /**
   * Whether the current user can view and act on church-level requests.
   * Only super_admin and church_admin have this capability.
   * Delegates to UserType.canSeeChurchDashboard() — no raw strings.
   */
  const canViewChurchRequests = computed(() =>
    UserType.canSeeChurchDashboard(authStore.user?.user_type),
  )

  return {
    // State
    requests: transferStore.requests,
    myRequests: transferStore.myRequests,
    churchRequests: transferStore.churchRequests,
    loading: transferStore.loading,
    error: transferStore.error,

    // Computed
    hasPendingRequests: transferStore.hasPendingRequests,
    pendingCount: transferStore.pendingCount,
    canViewChurchRequests,

    // Actions
    fetchAllRequests: transferStore.fetchAllRequests,
    fetchMyRequests: transferStore.fetchMyRequests,
    fetchChurchRequests: transferStore.fetchChurchRequests,
    createTransferRequest: transferStore.createTransferRequest,
    approveRequest: transferStore.approveRequest,
    rejectRequest: transferStore.rejectRequest,
    cancelRequest: transferStore.cancelRequest,
    clearRequests: transferStore.clearRequests,
  }
}
