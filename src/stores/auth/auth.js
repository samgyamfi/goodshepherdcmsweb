import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/utils/toast'
import { useLandingPageStore } from '@/stores/landingPage'
// Imported at module level; calling useChurchStore() happens only inside actions
// so the circular reference (auth ↔ church ← api ← auth) is resolved by the
// time any function is invoked.
import { useChurchStore } from '@/stores/church'
import { UserType } from '@/enums'

/**
 * Authentication Store
 * Manages user authentication state with automatic persistence.
 *
 * Church context seeding strategy
 * ─────────────────────────────────
 * The login response and /auth/me both return the user's active profile
 * including the nested church object. setAuthData() and fetchUser() both
 * call _seedChurchFromUser() to propagate that church into the church store
 * immediately, so the router guard can make routing decisions before any
 * component mounts — no DashboardLayout.vue routing hack needed.
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // ── State ─────────────────────────────────────────────────────────────────
    const user = ref(null)
    const token = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // ── Getters ───────────────────────────────────────────────────────────────
    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const fullName = computed(() => {
      if (!user.value) return ''
      return `${user.value.first_name} ${user.value.last_name}`
    })

    const userRoles = computed(() => user.value?.roles?.map((r) => r.name) ?? [])

    const userInitials = computed(() => {
      if (!user.value) return 'U'
      const first = user.value.first_name?.[0] ?? ''
      const last = user.value.last_name?.[0] ?? ''
      return (first + last).toUpperCase() || 'U'
    })

    /** Whether the current user is a super administrator */
    const isSuperAdmin = computed(() => user.value?.user_type === UserType.SUPER_ADMIN)

    /**
     * Whether the current user has an active church profile.
     * Derived from the login/me response, so the guard and useLogin can
     * use it synchronously after authentication resolves.
     */
    const hasActiveChurch = computed(() => !!user.value?.profile?.church)

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Propagate the active church from the user object into the church store.
     * Called after every successful login and me() refresh.
     * Only updates the store when the church UUID actually changed, avoiding
     * unnecessary reactive writes.
     */
    function _seedChurchFromUser(userData) {
      const church = userData?.profile?.church
      if (!church) return

      const churchStore = useChurchStore()
      if (churchStore.church?.uuid !== church.uuid) {
        churchStore.church = church
      }
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    /** Login user with email/phone and password */
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

    /** Logout user and clear all state */
    async function logout() {
      try {
        if (token.value) {
          await authService.logout()
        }
        showToast.info('Logged out successfully')
      } catch {
        // Ignore logout errors — we always clear state
      } finally {
        clearAuthData()
        sessionStorage.removeItem('welcome_shown')
        useLandingPageStore().clearCache()
      }
    }

    /**
     * Re-fetch the current user from /auth/me (called on hard refresh / new tab).
     * Fixes a previous bug where `user.value = response.data` was set instead of
     * `response.data.user`, causing the user object to be the entire response
     * wrapper rather than the actual user payload.
     * Also re-seeds the church store with fresh profile data.
     */
    async function fetchUser() {
      if (!token.value) return false

      isLoading.value = true

      try {
        const response = await authService.getUser()
        // response shape: { status: true, data: { user: {...} } }

        if (response.status && response.data) {
          user.value = response.data.user // ← was incorrectly response.data
          _seedChurchFromUser(response.data.user)
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

    /** Check if user has a specific Spatie role */
    function hasRole(role) {
      return userRoles.value.includes(role)
    }

    /** Check if user has any of the given Spatie roles */
    function hasAnyRole(roles) {
      return roles.some((role) => userRoles.value.includes(role))
    }

    /**
     * Persist authentication data from the login response.
     * payload shape: { user: {...}, authorisation: { token, expires_in, ... } }
     *
     * Immediately seeds the church store so the guard can make routing
     * decisions without waiting for a component lifecycle hook.
     */
    function setAuthData(data) {
      user.value = data.user
      token.value = data.authorisation.token
      _seedChurchFromUser(data.user)
    }

    /** Clear all authentication and church state */
    function clearAuthData() {
      user.value = null
      token.value = null
      error.value = null
      useChurchStore().clearChurchData()
    }

    /**
     * Initialize auth from a persisted token (hard refresh, new tab).
     * Calls /auth/me to validate the token and hydrate user + church data.
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
      isSuperAdmin,
      hasActiveChurch,

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
      paths: ['user', 'token'],
    },
  },
)
