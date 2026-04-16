import { ref, computed } from 'vue'

/**
 * Smart pagination composable for Laravel API responses
 *
 * Handles Laravel's LengthAwarePaginator structure:
 * {
 *   data: [...],
 *   meta: {
 *     current_page, last_page, per_page, total, from, to, path, links: [...]
 *   },
 *   links: {
 *     first, last, prev, next
 *   }
 * }
 *
 * @param {string} dataKey - The key in response.data that contains pagination (e.g., 'members', 'requests')
 * @param {number} defaultPerPage - Default items per page
 */
export function usePagination(dataKey = 'data', defaultPerPage = 15) {
  // Default per page options
  const perPageOptions = [10, 15, 20, 50, 100]

  // Pagination state
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(defaultPerPage)
  const total = ref(0)
  const from = ref(0)
  const to = ref(0)
  const path = ref('')
  const links = ref([])
  const firstLink = ref('')
  const lastLink = ref('')
  const prevLink = ref('')
  const nextLink = ref('')

  // Computed
  const hasPages = computed(() => lastPage.value > 1)
  const hasPrevPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < lastPage.value)
  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === lastPage.value)

  /**
   * Parse pagination data from API response
   * @param {Object} responseData - The response.data object from API
   */
  function parsePaginationData(responseData) {
    if (!responseData || !responseData[dataKey]) {
      resetPagination()
      return
    }

    const pagination = responseData[dataKey]

    // Extract meta
    if (pagination.meta) {
      currentPage.value = pagination.meta.current_page || 1
      lastPage.value = pagination.meta.last_page || 1
      perPage.value = pagination.meta.per_page || defaultPerPage
      total.value = pagination.meta.total || 0
      from.value = pagination.meta.from || 0
      to.value = pagination.meta.to || 0
      path.value = pagination.meta.path || ''
      links.value = pagination.meta.links || []
    }

    // Extract links
    if (pagination.links) {
      firstLink.value = pagination.links.first || ''
      lastLink.value = pagination.links.last || ''
      prevLink.value = pagination.links.prev || ''
      nextLink.value = pagination.links.next || ''
    }
  }

  /**
   * Get items array from pagination data
   * @param {Object} responseData - The response.data object from API
   * @returns {Array} Items array
   */
  function getItems(responseData) {
    if (!responseData || !responseData[dataKey]) {
      return []
    }
    return responseData[dataKey].data || []
  }

  /**
   * Reset pagination to defaults
   */
  function resetPagination() {
    currentPage.value = 1
    lastPage.value = 1
    perPage.value = defaultPerPage
    total.value = 0
    from.value = 0
    to.value = 0
    path.value = ''
    links.value = []
    firstLink.value = ''
    lastLink.value = ''
    prevLink.value = ''
    nextLink.value = ''
  }

  /**
   * Go to specific page
   * @param {number} page - Page number
   */
  function goToPage(page) {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page
    }
  }

  /**
   * Go to next page
   */
  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  /**
   * Go to previous page
   */
  function prevPage() {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  /**
   * Go to first page
   */
  function goToFirstPage() {
    currentPage.value = 1
  }

  /**
   * Go to last page
   */
  function goToLastPage() {
    currentPage.value = lastPage.value
  }

  /**
   * Set items per page
   * @param {number} value - Items per page
   */
  function setPerPage(value) {
    perPage.value = Number(value)
    currentPage.value = 1 // Reset to first page when changing per page
  }

  /**
   * Get page range for display (e.g., 1-10 of 100)
   */
  const pageRange = computed(() => {
    if (total.value === 0) return 'No items'
    return `${from.value}-${to.value} of ${total.value}`
  })

  /**
   * Get pagination summary (e.g., "Page 1 of 10")
   */
  const pageSummary = computed(() => {
    if (lastPage.value === 0) return 'Page 0 of 0'
    return `Page ${currentPage.value} of ${lastPage.value}`
  })

  return {
    // State
    currentPage,
    lastPage,
    perPage,
    total,
    from,
    to,
    path,
    links,
    firstLink,
    lastLink,
    prevLink,
    nextLink,
    perPageOptions,

    // Computed
    hasPages,
    hasPrevPage,
    hasNextPage,
    isFirstPage,
    isLastPage,
    pageRange,
    pageSummary,

    // Actions
    parsePaginationData,
    getItems,
    resetPagination,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setPerPage,
  }
}
