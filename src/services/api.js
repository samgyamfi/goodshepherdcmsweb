import axios from 'axios'
import { useAuthStore } from '@/stores/auth/auth'
import { useChurchStore } from '@/stores/church'
import { useSupportAccessStore } from '@/stores/supportAccess'
import router from '@/router'
import { handleApiError } from '@/utils/errorHandler'

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Request interceptor - adds auth token and church UUID to requests
 */
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const supportStore = useSupportAccessStore()
    const churchStore = useChurchStore()
    const supportToken = supportStore.token
    const token = supportToken || authStore.token
    config._supportAccessRequest = Boolean(supportToken)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add current church UUID to headers if available
    if (churchStore.church?.uuid) {
      config.headers['X-Church-UUID'] = churchStore.church.uuid
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * Response interceptor - handles errors globally
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const supportStore = useSupportAccessStore()

    // A support-token failure restores the still-valid platform session.
    if (error.response?.status === 401) {
      if (error.config?._supportAccessRequest || supportStore.isActive) {
        await supportStore.restorePlatformContext()
        await router.replace({ name: 'super-admin-dashboard', query: { support: 'expired' } })
        return Promise.reject(error)
      }

      authStore.logout()
      router.push({ name: 'login', query: { expired: 'true' } })
      return Promise.reject(error)
    }

    // Handle all other errors through error handler
    handleApiError(error)

    return Promise.reject(error)
  },
)

export default api
