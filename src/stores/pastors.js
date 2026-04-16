import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'
import generalHelpers from '@/utils/generalHelpers'

/**
 * Pastors Store
 *
 * Owns: pastors[], loading, error.
 * Does NOT own pagination — that belongs to usePagination in the composable.
 *
 * fetchPastors returns the raw paginated API object so the composable can
 * hand it to parsePaginationData directly.
 */
export const usePastorsStore = defineStore('pastors', () => {
  const pastors = ref([])
  const loading = ref(false)
  const error   = ref(null)

  async function fetchPastors(params = {}) {
    loading.value = true
    error.value   = null

    try {
      const response = await api.get('/pastors', { params })

      if (response.data.status) {
        const pastorsData = response.data.data.pastors
        pastors.value = pastorsData.data ?? pastorsData ?? []

        // Return the paginated collection so the composable can parse pagination
        return pastorsData
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch pastors'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createPastor(data) {
    loading.value = true
    error.value   = null

    try {
      const response = await api.post('/pastors', buildPastorPayload(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status) {
        showToast.success('Pastor created successfully')
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to create pastor')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updatePastor(id, data) {
    loading.value = true
    error.value   = null

    try {
      const response = await api.post(`/pastors/${id}?_method=PUT`, buildPastorPayload(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.status) {
        showToast.success('Pastor updated successfully')
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update pastor')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Batch-update display_order.
   * @param {Array<{id: number, display_order: number}>} orders
   */
  async function reorderPastors(orders) {
    try {
      const response = await api.post('/pastors/reorder', { orders })
      return response.data.status === true
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to reorder pastors')
      return false
    }
  }

  async function deletePastor(id) {
    loading.value = true
    error.value   = null

    try {
      const response = await api.delete(`/pastors/${id}`)

      if (response.data.status) {
        showToast.success('Pastor deleted successfully')
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete pastor')
      return false
    } finally {
      loading.value = false
    }
  }

  function clearPastors() {
    pastors.value = []
    error.value   = null
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  function buildPastorPayload(data) {
    const { photo, ...fields } = data
    return generalHelpers.jsonToFormData(
      photo instanceof File ? { ...fields, photo } : fields,
    )
  }

  return { pastors, loading, error, fetchPastors, createPastor, updatePastor, deletePastor, reorderPastors, clearPastors }
})
