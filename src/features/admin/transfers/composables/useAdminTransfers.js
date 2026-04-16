import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useTransferRequestsStore } from '@/stores/transferRequests'

/**
 * Composable for managing transfer requests in admin dashboard.
 * Integrates with usePagination for consistent pagination handling.
 */
export function useAdminTransfers() {
  const transferStore = useTransferRequestsStore()

  // Use smart pagination composable
  const pagination = usePagination('requests', 15)

  // Filters
  const searchQuery = ref('')
  const statusFilter = ref('')
  const dateRangeFilter = ref('')

  /**
   * Load transfers with current filters
   */
  async function loadTransfers() {
    const params = {
      page: pagination.currentPage.value,
      perPage: pagination.perPage.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      date_range: dateRangeFilter.value || undefined,
    }

    const success = await transferStore.fetchAllRequests(params)

    // Parse pagination data
    if (success && transferStore.requests) {
      pagination.parsePaginationData({ requests: transferStore.requests })
    }
  }

  /**
   * Approve transfer request
   */
  async function approveRequest(uuid) {
    const success = await transferStore.approveRequest(uuid)
    if (success) {
      await loadTransfers()
    }
    return success
  }

  /**
   * Reject transfer request
   */
  async function rejectRequest(uuid, reason = 'Rejected by admin') {
    const success = await transferStore.rejectRequest(uuid, reason)
    if (success) {
      await loadTransfers()
    }
    return success
  }

  /**
   * Cancel transfer request
   */
  async function cancelRequest(uuid) {
    const success = await transferStore.cancelRequest(uuid)
    if (success) {
      await loadTransfers()
    }
    return success
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    searchQuery.value = ''
    statusFilter.value = ''
    dateRangeFilter.value = ''
    loadTransfers()
  }

  /**
   * Computed stats for transfer requests
   */
  const stats = computed(() => {
    const requests = transferStore.requests || []
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length,
    }
  })

  return {
    // State
    requests: transferStore.requests,
    loading: transferStore.loading,
    error: transferStore.error,
    searchQuery,
    statusFilter,
    dateRangeFilter,
    stats,

    // Pagination
    currentPage: pagination.currentPage,
    lastPage: pagination.lastPage,
    perPage: pagination.perPage,
    total: pagination.total,
    from: pagination.from,
    to: pagination.to,
    perPageOptions: pagination.perPageOptions,

    // Actions
    loadTransfers,
    approveRequest,
    rejectRequest,
    cancelRequest,
    clearFilters,
  }
}
