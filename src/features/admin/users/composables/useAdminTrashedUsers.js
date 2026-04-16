import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useAdminDashboardStore } from '@/stores/adminDashboard'

/**
 * Composable for the "Deleted Users" tab.
 * Mirrors useAdminUsers but hits the trashed endpoint.
 */
export function useAdminTrashedUsers() {
  const store = useAdminDashboardStore()
  const searchQuery = ref('')
  const userTypeFilter = ref('')
  const trashedUsers = ref([])

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
  } = usePagination('trashedUsers', 15)

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

  async function loadTrashedUsers(params = {}) {
    const result = await store.fetchTrashedUsers({
      page: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value || undefined,
      user_type: userTypeFilter.value || undefined,
      ...params,
    })

    if (result) {
      trashedUsers.value = result.data ?? result ?? []
      parsePaginationData({ trashedUsers: result })
    }
  }

  function handlePageChange(page) {
    goToPage(page)
    loadTrashedUsers()
  }

  function handlePerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadTrashedUsers()
  }

  function handleSearch(value) {
    searchQuery.value = value
    goToPage(1)
    loadTrashedUsers()
  }

  function handleUserTypeFilter(value) {
    userTypeFilter.value = value
    goToPage(1)
    loadTrashedUsers()
  }

  return {
    trashedUsers,
    loading,
    error,
    searchQuery,
    userTypeFilter,
    pagination,
    perPageOptions,
    loadTrashedUsers,
    handlePageChange,
    handlePerPageChange,
    handleSearch,
    handleUserTypeFilter,
  }
}
