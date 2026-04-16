import { usePagination } from '@/composables/usePagination'
import { useChurchProgramsStore } from '@/stores/churchPrograms'

/**
 * Composable for managing church programs
 */
export function useChurchPrograms() {
  const store = useChurchProgramsStore()
  
  // Use smart pagination composable
  const pagination = usePagination('programs', 15)

  /**
   * Load programs with current filters
   */
  async function loadPrograms(filters = {}) {
    const params = {
      page: pagination.currentPage.value,
      perPage: pagination.perPage.value,
      ...filters,
    }
    
    const response = await store.fetchPrograms(params)
    
    // Parse pagination data
    if (response) {
      pagination.parsePaginationData({ programs: response })
    }
  }

  return {
    // State
    programs: store.programs,
    loading: store.loading,
    error: store.error,

    // Pagination
    currentPage: pagination.currentPage,
    lastPage: pagination.lastPage,
    perPage: pagination.perPage,
    total: pagination.total,
    from: pagination.from,
    to: pagination.to,
    perPageOptions: pagination.perPageOptions,

    // Actions
    loadPrograms,
    createProgram: store.createProgram,
    updateProgram: store.updateProgram,
    deleteProgram: store.deleteProgram,
    clearPrograms: store.clearPrograms,
  }
}
