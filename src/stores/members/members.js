import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { membersService } from '@/services/members/members'
import { showToast } from '@/utils/toast'

/**
 * Members Store
 * Manages members state and operations
 */
export const useMembersStore = defineStore(
  'members',
  () => {
    // State
    const members = ref([])
    const currentMember = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const pagination = ref({
      page: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,
    })

    // Getters
    const getMemberByUuid = computed(() => (uuid) => {
      return members.value.find((member) => member.uuid === uuid)
    })

    const getPendingMembers = computed(() => {
      return members.value.filter(
        (member) => member.status === 'pending' || member.status === 'pending_approval'
      )
    })

    const getActiveMembers = computed(() => {
      return members.value.filter((member) => member.status === 'active')
    })

    const getTotalMembers = computed(() => pagination.value.total)

    const getLastPage = computed(() => pagination.value.lastPage)

    /**
     * Fetch members with pagination and filters
     * @param {Object} params - Query parameters
     */
    async function fetchMembers(params = {}) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.getMembers(params)

        if (response.status && response.data) {
          members.value = response.data.data || []

          // Update pagination from meta
          if (response.meta) {
            pagination.value = {
              page: response.meta.current_page || 1,
              perPage: response.meta.per_page || 10,
              total: response.meta.total || 0,
              lastPage: response.meta.last_page || 1,
            }
          }

          return true
        }

        error.value = response.message || 'Failed to fetch members'
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while fetching members'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Create a new member
     * @param {Object} data - Member data
     * @returns {Promise<boolean>} - Success status
     */
    async function createMember(data) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.createMember(data)

        if (response.status && response.data) {
          members.value.unshift(response.data.data)
          currentMember.value = response.data.data
          showToast.created('Member')
          return true
        }

        error.value = response.message || 'Failed to create member'
        showToast.error(error.value)
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while creating member'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Update an existing member
     * @param {string|number} id - Member ID or UUID
     * @param {Object} data - Updated member data
     * @returns {Promise<boolean>} - Success status
     */
    async function updateMember(id, data) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.updateMember(id, data)

        if (response.status && response.data) {
          const index = members.value.findIndex((m) => m.uuid === id || m.id === id)
          if (index !== -1) {
            members.value[index] = response.data.data
          }
          currentMember.value = response.data.data
          showToast.updated('Member')
          return true
        }

        error.value = response.message || 'Failed to update member'
        showToast.error(error.value)
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while updating member'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Delete a member
     * @param {string|number} id - Member ID or UUID
     * @returns {Promise<boolean>} - Success status
     */
    async function deleteMember(id) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.deleteMember(id)

        if (response.status) {
          members.value = members.value.filter((m) => m.uuid !== id && m.id !== id)
          if (currentMember.value?.uuid === id || currentMember.value?.id === id) {
            currentMember.value = null
          }
          showToast.deleted('Member')
          return true
        }

        error.value = response.message || 'Failed to delete member'
        showToast.error(error.value)
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while deleting member'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Approve a pending member
     * @param {string|number} id - Member ID or UUID
     * @returns {Promise<boolean>} - Success status
     */
    async function approveMember(id) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.approveMember(id)

        if (response.status && response.data) {
          const index = members.value.findIndex((m) => m.uuid === id || m.id === id)
          if (index !== -1) {
            members.value[index] = response.data.data
          }
          if (currentMember.value?.uuid === id || currentMember.value?.id === id) {
            currentMember.value = response.data.data
          }
          showToast.success('Member approved successfully')
          return true
        }

        error.value = response.message || 'Failed to approve member'
        showToast.error(error.value)
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while approving member'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Suspend an active member
     * @param {string|number} id - Member ID or UUID
     * @returns {Promise<boolean>} - Success status
     */
    async function suspendMember(id) {
      loading.value = true
      error.value = null

      try {
        const response = await membersService.suspendMember(id)

        if (response.status && response.data) {
          const index = members.value.findIndex((m) => m.uuid === id || m.id === id)
          if (index !== -1) {
            members.value[index] = response.data.data
          }
          if (currentMember.value?.uuid === id || currentMember.value?.id === id) {
            currentMember.value = response.data.data
          }
          showToast.success('Member suspended successfully')
          return true
        }

        error.value = response.message || 'Failed to suspend member'
        showToast.error(error.value)
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while suspending member'
        showToast.error(error.value)
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Set the current member
     * @param {Object} member - Member data
     */
    function setCurrentMember(member) {
      currentMember.value = member
    }

    /**
     * Clear the current member
     */
    function clearCurrentMember() {
      currentMember.value = null
    }

    /**
     * Clear error
     */
    function clearError() {
      error.value = null
    }

    /**
     * Update pagination
     * @param {Object} newPagination - New pagination data
     */
    function updatePagination(newPagination) {
      pagination.value = { ...pagination.value, ...newPagination }
    }

    return {
      // State
      members,
      currentMember,
      loading,
      error,
      pagination,

      // Getters
      getMemberByUuid,
      getPendingMembers,
      getActiveMembers,
      getTotalMembers,
      getLastPage,

      // Actions
      fetchMembers,
      createMember,
      updateMember,
      deleteMember,
      approveMember,
      suspendMember,
      setCurrentMember,
      clearCurrentMember,
      clearError,
      updatePagination,
    }
  },
  {
    persist: {
      key: 'gsag-members',
      storage: localStorage,
      paths: ['currentMember'], // Only persist current member
    },
  },
)
