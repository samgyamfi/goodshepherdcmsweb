import { usePagination } from '@/composables/usePagination'
import { useChurchEventsStore } from '@/stores/churchEvents'

/**
 * Composable for managing church events
 */
export function useChurchEvents() {
  const store = useChurchEventsStore()
  
  // Use smart pagination composable
  const pagination = usePagination('events', 15)

  /**
   * Load events with current filters
   */
  async function loadEvents(filters = {}) {
    const params = {
      page: pagination.currentPage.value,
      perPage: pagination.perPage.value,
      ...filters,
    }
    
    const response = await store.fetchEvents(params)
    
    // Parse pagination data
    if (response) {
      pagination.parsePaginationData({ events: response })
    }
  }

  return {
    // State
    events: store.events,
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
    loadEvents,
    createEvent: store.createEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    clearEvents: store.clearEvents,
  }
}
