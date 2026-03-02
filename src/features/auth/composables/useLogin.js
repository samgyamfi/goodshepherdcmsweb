import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { showToast } from '@/utils/toast'

/**
 * Composable for login functionality
 * Handles form state, validation, and submission
 */
export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const identifier = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const rememberMe = ref(false)

  // Computed
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)

  const isFormValid = computed(() => {
    return identifier.value.trim().length > 0 && password.value.length >= 6
  })

  /**
   * Toggle password visibility
   */
  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  /**
   * Handle login form submission
   */
  async function handleLogin() {
    if (!isFormValid.value) {
      showToast.error('Please enter valid credentials')
      return
    }

    const payload = {
      identifier: identifier.value.trim(),
      password: password.value,
      remember: rememberMe.value,
    }

    const success = await authStore.login(payload)

    if (success) {
      // Clear welcome flag for new login
      sessionStorage.removeItem('welcome_shown')
      
      // Redirect to dashboard or intended route
      const redirectTo = router.currentRoute.value.query.redirect
      router.push(redirectTo || { name: 'dashboard' })
      // Welcome toast will show in DashboardView onMounted
    } else {
      showToast.error(authStore.error || 'Invalid credentials')
    }
  }

  /**
   * Navigate to forgot password page
   */
  function goToForgotPassword() {
    router.push({ name: 'forgot-password' })
  }

  return {
    // Form state
    identifier,
    password,
    showPassword,
    rememberMe,

    // Computed
    isLoading,
    error,
    isFormValid,

    // Actions
    togglePassword,
    handleLogin,
    goToForgotPassword,
  }
}
