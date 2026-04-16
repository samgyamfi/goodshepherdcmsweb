import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { showToast } from '@/utils/toast'

/**
 * Composable for login functionality.
 *
 * Post-login routing
 * ───────────────────
 *   1. Honor ?redirect= unless it points at /dashboard without a church context.
 *   2. Super admins → /admin
 *   3. Users with an active church profile → /dashboard
 *   4. Everyone else → /account/no-church (waiting state; login still succeeds)
 */
export function useLogin() {
  const router    = useRouter()
  const authStore = useAuthStore()

  const identifier   = ref('')
  const password     = ref('')
  const showPassword = ref(false)
  const rememberMe   = ref(false)

  const isLoading = computed(() => authStore.isLoading)
  const error     = computed(() => authStore.error)

  const isFormValid = computed(() =>
    identifier.value.trim().length > 0 && password.value.length >= 6,
  )

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  /**
   * If the guard stored a dashboard redirect but this user has no church,
   * sending them to /dashboard would immediately bounce to no-church anyway.
   * Skip straight to the holding page for a single navigation.
   */
  function shouldStripDashboardRedirect(redirectTo) {
    if (!redirectTo || authStore.isSuperAdmin || authStore.hasActiveChurch) {
      return false
    }
    const raw = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo
    const path = typeof raw === 'string' ? raw : raw?.path ?? ''
    return path === '/dashboard' || path.startsWith('/dashboard/')
  }

  async function handleLogin() {
    if (!isFormValid.value) {
      showToast.error('Please enter valid credentials')
      return
    }

    const payload = {
      identifier: identifier.value.trim(),
      password:   password.value,
      remember:   rememberMe.value,
    }

    const success = await authStore.login(payload)

    if (!success) {
      showToast.error(authStore.error || 'Invalid credentials')
      return
    }

    sessionStorage.removeItem('welcome_shown')

    const rawRedirect = router.currentRoute.value.query.redirect
    const redirectTo = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect

    if (redirectTo && !shouldStripDashboardRedirect(redirectTo)) {
      router.push(redirectTo)
      return
    }
    if (redirectTo && shouldStripDashboardRedirect(redirectTo)) {
      router.push({ name: 'no-church' })
      return
    }

    if (authStore.isSuperAdmin) {
      router.push({ name: 'admin-dashboard' })
      return
    }

    if (authStore.hasActiveChurch) {
      router.push({ name: 'dashboard' })
      return
    }

    router.push({ name: 'no-church' })
  }

  function goToForgotPassword() {
    router.push({ name: 'forgot-password' })
  }

  return {
    identifier,
    password,
    showPassword,
    rememberMe,
    isLoading,
    error,
    isFormValid,
    togglePassword,
    handleLogin,
    goToForgotPassword,
  }
}
