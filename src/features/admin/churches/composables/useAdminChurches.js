import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { useAdminDashboardStore } from '@/stores/adminDashboard'

/**
 * Composable for managing churches in the admin dashboard.
 *
 * Contract:
 * - Store  → owns churches[], loading, error
 * - Here   → owns all pagination state via usePagination
 *
 * fetchChurches returns the raw paginated collection; we wrap it as
 * { churches: <obj> } and pass it to parsePaginationData.
 */
export function useAdminChurches() {
  const store = useAdminDashboardStore()
  const searchQuery = ref('')

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
  } = usePagination('churches', 15)

  const churches = computed(() => store.churches)
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

  async function loadChurches(params = {}) {
    const result = await store.fetchChurches({
      page: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value || undefined,
      ...params,
    })

    parsePaginationData({ churches: result })
  }

  function handlePageChange(page) {
    goToPage(page)
    loadChurches()
  }

  function handlePerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadChurches()
  }

  function handleSearch(value) {
    searchQuery.value = value
    goToPage(1)
    loadChurches()
  }

  return {
    churches,
    loading,
    error,
    searchQuery,
    pagination,
    perPageOptions,
    loadChurches,
    handlePageChange,
    handlePerPageChange,
    handleSearch,
  }
}
