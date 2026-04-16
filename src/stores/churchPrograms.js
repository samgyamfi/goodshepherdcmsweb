import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

/**
 * Church Programs Store
 */
export const useChurchProgramsStore = defineStore('churchPrograms', () => {
  // State
  const programs = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch programs with pagination
   */
  async function fetchPrograms(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/programs', { params })

      if (response.data.status) {
        const programsData = response.data.data.programs
        
        // Extract programs array
        if (programsData.data) {
          programs.value = programsData.data
        } else {
          programs.value = programsData || []
        }
        
        // Return full response for pagination parsing
        return response.data.data.programs
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch programs'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new program
   */
  async function createProgram(data) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/programs', data)

      if (response.data.status) {
        showToast.success('Program created successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create program'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a program
   */
  async function updateProgram(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/programs/${id}`, data)

      if (response.data.status) {
        showToast.success('Program updated successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update program'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a program
   */
  async function deleteProgram(id) {
    loading.value = true
    error.value = null

    try {
      const response = await api.delete(`/programs/${id}`)

      if (response.data.status) {
        showToast.success('Program deleted successfully')
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete program'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear programs list
   */
  function clearPrograms() {
    programs.value = []
    error.value = null
  }

  return {
    // State
    programs,
    loading,
    error,

    // Actions
    fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    clearPrograms,
  }
})
