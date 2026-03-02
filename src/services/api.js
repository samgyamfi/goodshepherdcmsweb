import axios from 'axios'
import { useAuthStore } from '@/stores/auth/auth'
import router from '@/router'

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
 * Request interceptor - adds auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

    // Handle 401 Unauthorized - logout and redirect to login
    if (error.response?.status === 401) {
      authStore.logout()
      router.push({ name: 'login', query: { expired: 'true' } })
      return Promise.reject(error)
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data?.message)
    }

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      // Validation errors are handled by the caller
      return Promise.reject(error)
    }

    // Handle 500 Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data?.message)
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error: Please check your connection')
    }

    return Promise.reject(error)
  },
)

export default api
