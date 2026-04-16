import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

/**
 * Church Transfer Requests Store
 * Manages church transfer request operations
 */
export const useTransferRequestsStore = defineStore('transferRequests', () => {
  // State
  const requests = ref([])
  const myRequests = ref([])
  const churchRequests = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const hasPendingRequests = computed(() => {
    return myRequests.value.some(r => r.status === 'pending')
  })

  const pendingCount = computed(() => {
    return myRequests.value.filter(r => r.status === 'pending').length
  })

  /**
   * Fetch all transfer requests (super admin)
   */
  async function fetchAllRequests(filters = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/church/transfers', { params: filters })

      if (response.data.status) {
        requests.value = response.data.data.requests?.data || []
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch requests'
      showToast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch user's pending requests
   */
  async function fetchMyRequests() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/church/transfers/my-requests')

      if (response.data.status) {
        myRequests.value = response.data.data.requests || []
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch your requests'
      showToast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch incoming requests for current church
   */
  async function fetchChurchRequests() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/church/transfers/church-requests')

      if (response.data.status) {
        churchRequests.value = response.data.data.requests || []
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch church requests'
      showToast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new transfer request
   */
  async function createTransferRequest(toChurchId, reason = '') {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/church/transfers', {
        to_church_id: toChurchId,
        reason: reason,
      })

      if (response.data.status) {
        showToast.success('Transfer request submitted successfully')
        await fetchMyRequests() // Refresh list
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit transfer request'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Approve a transfer request
   */
  async function approveRequest(requestId) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/church/transfers/${requestId}/approve`)

      if (response.data.status) {
        showToast.success('Transfer request approved')
        await fetchChurchRequests() // Refresh list
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve request'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Reject a transfer request
   */
  async function rejectRequest(requestId, reason) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/church/transfers/${requestId}/reject`, {
        reason: reason,
      })

      if (response.data.status) {
        showToast.success('Transfer request rejected')
        await fetchChurchRequests() // Refresh list
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reject request'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancel a transfer request
   */
  async function cancelRequest(requestId) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/church/transfers/${requestId}/cancel`)

      if (response.data.status) {
        showToast.success('Transfer request cancelled')
        await fetchMyRequests() // Refresh list
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to cancel request'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear requests
   */
  function clearRequests() {
    requests.value = []
    myRequests.value = []
    churchRequests.value = []
    error.value = null
  }

  return {
    // State
    requests,
    myRequests,
    churchRequests,
    loading,
    error,

    // Computed
    hasPendingRequests,
    pendingCount,

    // Actions
    fetchAllRequests,
    fetchMyRequests,
    fetchChurchRequests,
    createTransferRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    clearRequests,
  }
})
