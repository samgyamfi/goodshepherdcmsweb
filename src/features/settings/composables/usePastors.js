import { ref, computed } from 'vue'
import { usePagination } from '@/composables/usePagination'
import { usePastorsStore } from '@/stores/pastors'

/**
 * Composable for managing pastors with pagination, search, and CRUD.
 *
 * Single source of truth contract:
 * - Store  → owns pastors[], loading, error
 * - Here   → owns all pagination state via usePagination
 *
 * After each fetch the store returns the raw paginated API object.
 * We wrap it as { pastors: <obj> } and hand it to parsePaginationData,
 * which knows how to extract meta/links from responseData['pastors'].
 */
export function usePastors() {
  const store       = usePastorsStore()
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
  } = usePagination('pastors', 15)

  const pastors   = computed(() => store.pastors)
  const loading   = computed(() => store.loading)
  const error     = computed(() => store.error)

  const pagination = computed(() => ({
    currentPage: currentPage.value,
    lastPage:    lastPage.value,
    perPage:     perPage.value,
    total:       total.value,
    from:        from.value,
    to:          to.value,
  }))

  async function loadPastors(params = {}) {
    const result = await store.fetchPastors({
      page:    currentPage.value,
      perPage: perPage.value,
      search:  searchQuery.value || undefined,
      ...params,
    })

    // result = the raw paginated collection ({ data, meta, links })
    // wrap it so parsePaginationData can find responseData['pastors']
    parsePaginationData({ pastors: result })
  }

  function handlePageChange(page) {
    goToPage(page)
    loadPastors()
  }

  function handlePerPageChange(newPerPage) {
    setPerPage(newPerPage)
    loadPastors()
  }

  function handleSearch(value) {
    searchQuery.value = value
    goToPage(1)
    loadPastors()
  }

  return {
    pastors,
    loading,
    error,
    searchQuery,
    pagination,
    perPageOptions,

    loadPastors,
    createPastor:    (...args) => store.createPastor(...args),
    updatePastor:    (...args) => store.updatePastor(...args),
    deletePastor:    (...args) => store.deletePastor(...args),
    reorderPastors:  (...args) => store.reorderPastors(...args),

    handlePageChange,
    handlePerPageChange,
    handleSearch,
  }
}
