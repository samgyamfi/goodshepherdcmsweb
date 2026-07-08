import { computed } from 'vue'
import { useTransferRequestsStore } from '@/stores/transferRequests'
import { useAuthStore } from '@/stores/auth/auth'

/**
 * Composable for managing church transfer requests.
 * Uses the transfer requests store for state management.
 */
export function useTransferRequests() {
  const transferStore = useTransferRequestsStore()
  const authStore = useAuthStore()

  /**
   * Whether the current user can view and act on church-level requests.
   * Driven by Spatie permissions exposed on the auth user.
   */
  const canViewChurchRequests = computed(() =>
    authStore.canAny(['users.approve', 'users.suspend']),
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
