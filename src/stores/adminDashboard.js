import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

/**
 * Admin Dashboard Store
 *
 * All backend mutations use UUID — never numeric ID — to prevent enumeration attacks.
 *
 * fetchChurches / fetchUsers return the raw paginated collection object
 * ({ data, meta, links }) so each composable can hand it to parsePaginationData.
 */
export const useAdminDashboardStore = defineStore('adminDashboard', () => {
  const stats    = ref(null)
  const churches = ref([])
  const users    = ref([])
  const loading  = ref(false)
  const error    = ref(null)

  // ── Stats ───────────────────────────────────────────────────────────────────

  async function fetchStats() {
    loading.value = true
    error.value   = null
    try {
      const response = await api.get('/admin/dashboard')
      if (response.data.status) {
        stats.value = response.data.data.stats ?? {}
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch stats'
      showToast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  // ── Churches ────────────────────────────────────────────────────────────────

  async function fetchChurches(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const response = await api.get('/admin/churches', { params })
      if (response.data.status) {
        const churchesData = response.data.data.churches
        churches.value = churchesData.data ?? churchesData ?? []
        return churchesData
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch churches'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchTrashedChurches(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const response = await api.get('/admin/churches/trashed', { params })
      if (response.data.status) return response.data.data.churches
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch deleted churches'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /** uuid — the church's UUID string, never a numeric id */
  async function toggleChurchStatus(uuid) {
    try {
      const response = await api.patch(`/admin/churches/${uuid}/toggle-status`)
      if (response.data.status) {
        const updated = response.data.data.church
        const idx = churches.value.findIndex((c) => c.uuid === uuid)
        if (idx !== -1) churches.value[idx] = updated
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update church status')
      return false
    }
  }

  async function deleteChurch(uuid) {
    try {
      const response = await api.delete(`/admin/churches/${uuid}`)
      if (response.data.status) {
        churches.value = churches.value.filter((c) => c.uuid !== uuid)
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete church')
      return false
    }
  }

  async function restoreChurch(uuid) {
    try {
      const response = await api.post(`/admin/churches/${uuid}/restore`)
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to restore church')
      return false
    }
  }

  async function forceDeleteChurch(uuid) {
    try {
      const response = await api.delete(`/admin/churches/${uuid}/force`)
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to permanently delete church')
      return false
    }
  }

  /** uuids — array of UUID strings */
  async function bulkChurchAction(action, uuids) {
    try {
      const response = await api.post('/admin/churches/bulk', { action, uuids })
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Bulk action failed')
      return false
    }
  }

  // ── Users ───────────────────────────────────────────────────────────────────

  async function fetchUsers(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const response = await api.get('/admin/users', { params })
      if (response.data.status) {
        const usersData = response.data.data.users
        users.value = usersData.data ?? usersData ?? []
        return usersData
      }
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchTrashedUsers(params = {}) {
    loading.value = true
    error.value   = null
    try {
      const response = await api.get('/admin/users/trashed', { params })
      if (response.data.status) return response.data.data.users
      return null
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch deleted users'
      showToast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchUserDetail(uuid) {
    try {
      const response = await api.get(`/admin/users/${uuid}`)
      if (response.data.status) return response.data.data.user
      return null
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to load user details')
      return null
    }
  }

  async function deleteUser(uuid) {
    try {
      const response = await api.delete(`/admin/users/${uuid}`)
      if (response.data.status) {
        users.value = users.value.filter((u) => u.uuid !== uuid)
        return true
      }
      return false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete user')
      return false
    }
  }

  async function restoreUser(uuid) {
    try {
      const response = await api.post(`/admin/users/${uuid}/restore`)
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to restore user')
      return false
    }
  }

  async function forceDeleteUser(uuid) {
    try {
      const response = await api.delete(`/admin/users/${uuid}/force`)
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to permanently delete user')
      return false
    }
  }

  async function bulkUserAction(action, uuids) {
    try {
      const response = await api.post('/admin/users/bulk', { action, uuids })
      return response.data.status ?? false
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Bulk action failed')
      return false
    }
  }

  function clearData() {
    stats.value    = null
    churches.value = []
    users.value    = []
    error.value    = null
  }

  return {
    stats,
    churches,
    users,
    loading,
    error,
    fetchStats,
    fetchChurches,
    fetchTrashedChurches,
    fetchUsers,
    fetchTrashedUsers,
    fetchUserDetail,
    toggleChurchStatus,
    deleteChurch,
    restoreChurch,
    forceDeleteChurch,
    bulkChurchAction,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    bulkUserAction,
    clearData,
  }
})
