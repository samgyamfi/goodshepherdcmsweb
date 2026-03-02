import { ref, computed } from 'vue'
import { useMembersStore } from '@/stores/members/members'
import { useAuthStore } from '@/stores/auth/auth'
import { debounce } from '@/utils/debounce'

/**
 * Composable for members list management
 * Handles table data, pagination, search, and filtering
 */
export function useMembers() {
  const membersStore = useMembersStore()
  const authStore = useAuthStore()

  // Local state
  const searchQuery = ref('')
  const currentPage = ref(1)
  const rowsPerPage = ref(10)
  const statusFilter = ref('')
  const membershipStatusFilter = ref('')
  const isSearching = ref(false)

  // Computed
  const members = computed(() => membersStore.members)
  const loading = computed(() => membersStore.loading)
  const pagination = computed(() => membersStore.pagination)
  const error = computed(() => membersStore.error)

  const totalPages = computed(() => pagination.value.lastPage)
  const totalItems = computed(() => pagination.value.total)

  const canManageMembers = computed(() => {
    return authStore.hasAnyRole(['super_admin', 'admin', 'secretary'])
  })

  const canDeleteMembers = computed(() => {
    return authStore.hasRole('super_admin')
  })

  // Build query params for API
  function buildQueryParams() {
    const params = {
      page: currentPage.value,
      per_page: rowsPerPage.value,
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    if (membershipStatusFilter.value) {
      params.membership_status = membershipStatusFilter.value
    }

    return params
  }

  // Fetch members with current filters
  async function loadMembers() {
    const params = buildQueryParams()
    await membersStore.fetchMembers(params)
  }

  // Debounced search
  const debouncedSearch = debounce(() => {
    currentPage.value = 1 // Reset to first page on search
    loadMembers()
    isSearching.value = false
  }, 300)

  // Handle search input
  function handleSearch(query) {
    searchQuery.value = query
    isSearching.value = true
    debouncedSearch()
  }

  // Handle page change
  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      loadMembers()
    }
  }

  // Handle rows per page change
  function handleRowsPerPageChange(perPage) {
    rowsPerPage.value = perPage
    currentPage.value = 1 // Reset to first page
    loadMembers()
  }

  // Handle status filter change
  function handleStatusFilterChange(status) {
    statusFilter.value = status
    currentPage.value = 1
    loadMembers()
  }

  // Handle membership status filter change
  function handleMembershipStatusFilterChange(status) {
    membershipStatusFilter.value = status
    currentPage.value = 1
    loadMembers()
  }

  // Clear all filters
  function clearFilters() {
    searchQuery.value = ''
    statusFilter.value = ''
    membershipStatusFilter.value = ''
    currentPage.value = 1
    loadMembers()
  }

  // Refresh members list
  function refresh() {
    loadMembers()
  }

  // Get status badge variant
  function getStatusVariant(status) {
    const variants = {
      active: 'default',
      pending: 'secondary',
      pending_approval: 'secondary',
      suspended: 'destructive',
      inactive: 'outline',
    }
    return variants[status?.toLowerCase()] || 'outline'
  }

  // Get status label
  function getStatusLabel(status) {
    const labels = {
      active: 'Active',
      pending: 'Pending',
      pending_approval: 'Pending Approval',
      suspended: 'Suspended',
      inactive: 'Inactive',
    }
    return labels[status?.toLowerCase()] || status
  }

  // Get membership status badge variant
  function getMembershipStatusVariant(status) {
    const variants = {
      active: 'default',
      inactive: 'outline',
      visitor: 'secondary',
      transferred: 'secondary',
    }
    return variants[status?.toLowerCase()] || 'outline'
  }

  // Initialize
  function initialize() {
    loadMembers()
  }

  // Cleanup
  function dispose() {
    debouncedSearch.cancel()
  }

  return {
    // State
    searchQuery,
    currentPage,
    rowsPerPage,
    statusFilter,
    membershipStatusFilter,
    isSearching,

    // Computed
    members,
    loading,
    pagination,
    error,
    totalPages,
    totalItems,
    canManageMembers,
    canDeleteMembers,

    // Actions
    loadMembers,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleStatusFilterChange,
    handleMembershipStatusFilterChange,
    clearFilters,
    refresh,
    initialize,
    dispose,

    // Helpers
    getStatusVariant,
    getStatusLabel,
    getMembershipStatusVariant,
  }
}
