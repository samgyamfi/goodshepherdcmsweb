import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'

const router = useRouter()

/**
 * Handle API errors with special error code handling
 */
export function handleApiError(error) {
  const errorData = error.response?.data
  
  if (!errorData) {
    showToast.error('Network error. Please check your connection.')
    return
  }
  
  // Handle specific error codes
  switch (errorData.error_code) {
    case 'CHURCH_SELECTION_REQUIRED':
      // Redirect to church selection page
      router.push({ 
        name: 'church-select',
        query: { redirect: router.currentRoute.value?.fullPath }
      })
      return
      
    case 'CHURCH_NOT_ACTIVE':
      router.push({ name: 'church-subscription-inactive' })
      return
      
    case 'UNAUTHENTICATED':
      router.push({ name: 'login' })
      return
      
    default:
      // Generic error handling
      showToast.error(errorData.message || 'An error occurred')
  }
}

/**
 * Handle API success with optional toast
 */
export function handleApiSuccess(response, showToastMessage = true) {
  if (showToastMessage && response.data?.message) {
    showToast.success(response.data.message)
  }
  return response.data
}
