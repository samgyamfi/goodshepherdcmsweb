import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

/**
 * Church Events Store
 */
export const useChurchEventsStore = defineStore('churchEvents', () => {
  // State
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch events with pagination
   */
  async function fetchEvents(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/events', { params })

      if (response.data.status) {
        const eventsData = response.data.data.events
        
        // Extract events array
        if (eventsData.data) {
          events.value = eventsData.data
        } else {
          events.value = eventsData || []
        }
        
        // Return full response for pagination parsing
        return response.data.data.events
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch events'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new event
   */
  async function createEvent(data) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/events', data)

      if (response.data.status) {
        showToast.success('Event created successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create event'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an event
   */
  async function updateEvent(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/events/${id}`, data)

      if (response.data.status) {
        showToast.success('Event updated successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update event'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an event
   */
  async function deleteEvent(id) {
    loading.value = true
    error.value = null

    try {
      const response = await api.delete(`/events/${id}`)

      if (response.data.status) {
        showToast.success('Event deleted successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete event'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear events list
   */
  function clearEvents() {
    events.value = []
    error.value = null
  }

  return {
    // State
    events,
    loading,
    error,

    // Actions
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearEvents,
  }
})
