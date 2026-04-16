import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useAdminDashboardStore } from '@/stores/adminDashboard'

/**
 * Composable for the "Deleted Churches" tab.
 * Mirrors useAdminChurches but hits the trashed endpoint.
 */
export function useAdminTrashedChurches() {
  const store = useAdminDashboardStore()
  const searchQuery = ref('')
  const trashedChurches = ref([])

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
  } = usePagination('trashedChurches', 15)

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

  async function loadTrashedChurches(params = {}) {
    const result = await store.fetchTrashedChurches({
      page: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value || undefined,
      ...params,
    })

    if (result) {
      trashedChurches.value = result.data ?? result ?? []
      parsePaginationData({ trashedChurches: result })
    }
  }

  function handlePageChange(page) {
    goToPage(page)
    loadTrashedChurches()
  }

  function handlePerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadTrashedChurches()
  }

  function handleSearch(value) {
    searchQuery.value = value
    goToPage(1)
    loadTrashedChurches()
  }

  return {
    trashedChurches,
    loading,
    error,
    searchQuery,
    pagination,
    perPageOptions,
    loadTrashedChurches,
    handlePageChange,
    handlePerPageChange,
    handleSearch,
  }
}
