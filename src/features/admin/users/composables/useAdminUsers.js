import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useAdminDashboardStore } from '@/stores/adminDashboard'

/**
 * Composable for managing users in the admin dashboard.
 *
 * Contract:
 * - Store  → owns users[], loading, error
 * - Here   → owns all pagination state via usePagination
 */
export function useAdminUsers() {
  const store = useAdminDashboardStore()
  const searchQuery = ref('')
  const userTypeFilter = ref('')

  const {
    currentPage,
    lastPage,
    perPage,
    total,
    from,
    to,
    perPageOptions,
    parsePaginationData,
    goToPage,
    setPerPage,
  } = usePagination('users', 15)

  const users = computed(() => store.users)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  const pagination = computed(() => ({
    currentPage: currentPage.value,
    lastPage: lastPage.value,
    perPage: perPage.value,
    total: total.value,
    from: from.value,
    to: to.value,
  }))

  async function loadUsers(params = {}) {
    const result = await store.fetchUsers({
      page: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value || undefined,
      user_type: userTypeFilter.value || undefined,
      ...params,
    })

    parsePaginationData({ users: result })
  }

  function handlePageChange(page) {
    goToPage(page)
    loadUsers()
  }

  function handlePerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadUsers()
  }

  function handleSearch(value) {
    searchQuery.value = value
    goToPage(1)
    loadUsers()
  }

  function handleUserTypeFilter(value) {
    userTypeFilter.value = value
    goToPage(1)
    loadUsers()
  }

  return {
    users,
    loading,
    error,
    searchQuery,
    userTypeFilter,
    pagination,
    perPageOptions,
    loadUsers,
    handlePageChange,
    handlePerPageChange,
    handleSearch,
    handleUserTypeFilter,
  }
}
