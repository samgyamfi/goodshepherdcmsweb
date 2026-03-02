import { toast } from 'vue3-toastify'

/**
 * Toast notification utilities
 * Provides consistent toast notifications throughout the app
 */
export const showToast = {
  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {object} options - Additional toast options
   */
  success(message, options = {}) {
    toast.success(message, {
      autoClose: 2000,
      ...options,
    })
  },

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {object} options - Additional toast options
   */
  error(message, options = {}) {
    toast.error(message, {
      autoClose: 4000,
      ...options,
    })
  },

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {object} options - Additional toast options
   */
  info(message, options = {}) {
    toast.info(message, {
      autoClose: 3000,
      ...options,
    })
  },

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {object} options - Additional toast options
   */
  warning(message, options = {}) {
    toast.warning(message, {
      autoClose: 3000,
      ...options,
    })
  },

  /**
   * Show success toast for entity creation
   * @param {string} entity - Entity name (e.g., "Role", "Member")
   */
  created(entity) {
    this.success(`${entity} created successfully`)
  },

  /**
   * Show success toast for entity update
   * @param {string} entity - Entity name (e.g., "Role", "Member")
   */
  updated(entity) {
    this.success(`${entity} updated successfully`)
  },

  /**
   * Show success toast for entity deletion
   * @param {string} entity - Entity name (e.g., "Role", "Member")
   */
  deleted(entity) {
    this.success(`${entity} deleted successfully`)
  },
}
