import { ref, computed } from 'vue'
import { useMembersStore } from '@/stores/members/members'
import { useAuthStore } from '@/stores/auth/auth'
import { debounce } from '@/utils/debounce'
import { usePagination } from '@/composables/usePagination'

/**
 * Composable for members list management.
 * Handles table data, pagination, search, and filtering.
 *
 * Pagination is owned by usePagination; after each fetch, state is synced
 * from the store's parsed pagination object (store.pagination).
 */
export function useMembers() {
  const membersStore = useMembersStore()
  const authStore = useAuthStore()

  const {
    currentPage,
    lastPage,
    perPage,
    total,
    from,
    to,
    perPageOptions,
    goToPage,
    setPerPage,
  } = usePagination('members', 15)

  // Local filters
  const searchQuery            = ref('')
  const statusFilter           = ref('')
  const membershipStatusFilter = ref('')
  const isSearching            = ref(false)

  // Reactive store wrappers
  const members = computed(() => membersStore.members)
  const loading = computed(() => membersStore.loading)
  const error   = computed(() => membersStore.error)

  const canManageMembers = computed(() =>
    authStore.canAny(['members.create', 'members.update'])
  )
  const canDeleteMembers = computed(() =>
    authStore.can('members.delete')
  )
  const canImportMembers = computed(() =>
    authStore.can('members.import')
  )
  const canExportMembers = computed(() =>
    authStore.can('members.export')
  )
  const canAssignMemberPermissions = computed(() =>
    authStore.can('permissions.assign')
  )

  function buildQueryParams() {
    const params = {
      page:    currentPage.value,
      perPage: perPage.value,
    }

    if (searchQuery.value?.trim()) params.search = searchQuery.value.trim()
    if (statusFilter.value && statusFilter.value !== 'all') params.status = statusFilter.value
    if (membershipStatusFilter.value && membershipStatusFilter.value !== 'all') {
      params.membership_status = membershipStatusFilter.value
    }

    return params
  }

  async function loadMembers() {
    const params = buildQueryParams()
    await membersStore.fetchMembers(params)

    // Sync pagination from what the store parsed out of the API response
    const p = membersStore.pagination
    if (p) {
      currentPage.value = p.currentPage ?? p.current_page ?? 1
      lastPage.value    = p.lastPage    ?? p.last_page    ?? 1
      perPage.value     = p.perPage     ?? p.per_page     ?? 15
      total.value       = p.total       ?? 0
      from.value        = p.from        ?? 0
      to.value          = p.to          ?? 0
    }
  }

  const debouncedSearch = debounce(() => {
    goToPage(1)
    loadMembers()
    isSearching.value = false
  }, 300)

  function handleSearch(query) {
    searchQuery.value = query
    isSearching.value = true
    debouncedSearch()
  }

  function handlePageChange(page) {
    goToPage(page)
    loadMembers()
  }

  function handleRowsPerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadMembers()
  }

  function handleStatusFilterChange(status) {
    statusFilter.value = status
    goToPage(1)
    loadMembers()
  }

  function handleMembershipStatusFilterChange(status) {
    membershipStatusFilter.value = status
    goToPage(1)
    loadMembers()
  }

  function clearFilters() {
    searchQuery.value            = ''
    statusFilter.value           = ''
    membershipStatusFilter.value = ''
    goToPage(1)
    loadMembers()
  }

  function initialize() {
    loadMembers()
  }

  // Cancel any pending debounced search to avoid state updates after teardown
  function dispose() {
    debouncedSearch.cancel()
  }

  return {
    // Filters
    searchQuery,
    statusFilter,
    membershipStatusFilter,
    isSearching,

    // Pagination refs (named consistently for table components)
    currentPage,
    lastPage,
    rowsPerPage: perPage,
    perPageOptions,
    totalItems: total,
    from,
    to,

    // Data
    members,
    loading,
    error,
    canManageMembers,
    canDeleteMembers,
    canImportMembers,
    canExportMembers,
    canAssignMemberPermissions,

    // Actions
    loadMembers,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleStatusFilterChange,
    handleMembershipStatusFilterChange,
    clearFilters,
    initialize,
    refresh: loadMembers,
    dispose,
  }
}
