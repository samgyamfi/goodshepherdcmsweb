import api from '../api'

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Login with email/phone and password
   */
  async login(payload) {
    const response = await api.post('/auth/login', payload)
    return response.data
  },

  /**
   * Logout current user
   */
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  /**
   * Get current authenticated user
   */
  async getUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Request password reset
   */
  async forgotPassword(identifier) {
    const response = await api.post('/auth/forgot-password', { identifier })
    return response.data
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, password, passwordConfirmation) {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  },

  /**
   * Set password for generated-password accounts
   */
  async setInitialPassword(password, passwordConfirmation) {
    const response = await api.post('/auth/set-initial-password', {
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  },

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}
