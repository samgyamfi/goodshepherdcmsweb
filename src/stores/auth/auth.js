import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/utils/toast'

/**
 * Authentication Store
 * Manages user authentication state with automatic persistence
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref(null)
    const token = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const fullName = computed(() => {
      if (!user.value) return ''
      return `${user.value.first_name} ${user.value.last_name}`
    })
    const userRoles = computed(() => user.value?.roles?.map((r) => r.name) || [])

    const userInitials = computed(() => {
      if (!user.value) return 'U'
      const first = user.value?.first_name?.[0] || ''
      const last = user.value?.last_name?.[0] || ''
      return (first + last).toUpperCase() || 'U'
    })

    /**
     * Login user with email/phone and password
     */
    async function login(payload) {
      isLoading.value = true
      error.value = null

      try {
        const response = await authService.login(payload)

        if (response.status && response.data) {
          setAuthData(response.data)
          return true
        }

        error.value = response.message || 'Login failed'
        return false
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred during login'
        return false
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Logout user and clear state
     */
    async function logout() {
      try {
        if (token.value) {
          await authService.logout()
        }
        showToast.info('Logged out successfully')
      } catch {
        // Ignore logout errors - we're clearing state anyway
      } finally {
        clearAuthData()
        sessionStorage.removeItem('welcome_shown')
      }
    }

    /**
     * Fetch current user data
     */
    async function fetchUser() {
      if (!token.value) return false

      isLoading.value = true

      try {
        const response = await authService.getUser()

        if (response.status && response.data) {
          user.value = response.data
          return true
        }

        return false
      } catch {
        clearAuthData()
        return false
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Check if user has a specific role
     */
    function hasRole(role) {
      return userRoles.value.includes(role)
    }

    /**
     * Check if user has any of the given roles
     */
    function hasAnyRole(roles) {
      return roles.some((role) => userRoles.value.includes(role))
    }

    /**
     * Set authentication data
     */
    function setAuthData(data) {
      user.value = data.user
      token.value = data.authorisation.token
    }

    /**
     * Clear authentication data
     */
    function clearAuthData() {
      user.value = null
      token.value = null
      error.value = null
    }

    /**
     * Initialize auth state from stored token
     */
    async function initializeAuth() {
      if (token.value) {
        await fetchUser()
      }
    }

    return {
      // State
      user,
      token,
      isLoading,
      error,

      // Getters
      isAuthenticated,
      fullName,
      userRoles,
      userInitials,

      // Actions
      login,
      logout,
      fetchUser,
      hasRole,
      hasAnyRole,
      initializeAuth,
      clearAuthData,
    }
  },
  {
    persist: {
      key: 'gsag-auth',
      storage: localStorage,
      paths: ['user', 'token'], // Only persist these fields
    },
  },
)
