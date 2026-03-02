import api from '../api'

/**
 * Members Service
 * Handles all members-related API calls
 */
export const membersService = {
  /**
   * Get all members with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.perPage - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status
   * @param {string} params.membershipStatus - Filter by membership status
   * @returns {Promise<Object>} - Paginated members response
   */
  async getMembers(params = {}) {
    const response = await api.get('/members', { params })
    return response.data
  },

  /**
   * Get a single member by ID
   * @param {string|number} id - Member ID or UUID
   * @returns {Promise<Object>} - Member data
   */
  async getMember(id) {
    const response = await api.get(`/members/${id}`)
    return response.data
  },

  /**
   * Create a new member
   * @param {Object} data - Member data
   * @returns {Promise<Object>} - Created member data
   */
  async createMember(data) {
    const response = await api.post('/members', data)
    return response.data
  },

  /**
   * Update an existing member
   * @param {string|number} id - Member ID or UUID
   * @param {Object} data - Updated member data
   * @returns {Promise<Object>} - Updated member data
   */
  async updateMember(id, data) {
    const response = await api.put(`/members/${id}`, data)
    return response.data
  },

  /**
   * Delete a member
   * @param {string|number} id - Member ID or UUID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  async deleteMember(id) {
    const response = await api.delete(`/members/${id}`)
    return response.data
  },

  /**
   * Approve a pending member
   * @param {string|number} id - Member ID or UUID
   * @returns {Promise<Object>} - Updated member data
   */
  async approveMember(id) {
    const response = await api.post(`/members/${id}/approve`)
    return response.data
  },

  /**
   * Suspend an active member
   * @param {string|number} id - Member ID or UUID
   * @returns {Promise<Object>} - Updated member data
   */
  async suspendMember(id) {
    const response = await api.post(`/members/${id}/suspend`)
    return response.data
  },

  /**
   * Get member statistics
   * @returns {Promise<Object>} - Member statistics
   */
  async getStats() {
    const response = await api.get('/members/stats')
    return response.data
  },

  /**
   * Export members to file
   * @param {Object} filters - Export filters
   * @param {string} format - Export format (excel, pdf)
   * @returns {Promise<Object>} - Export job response
   */
  async exportMembers(filters = {}, format = 'excel') {
    const response = await api.post('/members/export', { filters, format })
    return response.data
  },

  /**
   * Import members from file
   * @param {FormData} formData - Form data with file
   * @returns {Promise<Object>} - Import job response
   */
  async importMembers(formData) {
    const response = await api.post('/members/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
