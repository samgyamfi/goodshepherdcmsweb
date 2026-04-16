import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

/**
 * Church Content Management Store
 * Manages church landing page content
 */
export const useChurchContentStore = defineStore('churchContent', () => {
  // State
  const content = ref({})
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch current church content
   */
  async function fetchChurchContent() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/church/content-settings')

      if (response.data.status) {
        // Convert array to object keyed by section
        const contentObj = {}
        response.data.data.settings.forEach(setting => {
          contentObj[setting.section] = setting
        })
        content.value = contentObj
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch church content'
      showToast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Update content for a section with file upload
   */
  async function updateSection(section, contentData, files = {}) {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      
      // Add content data
      formData.append('content', JSON.stringify(contentData))
      formData.append('is_enabled', true)

      // Add files if any
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(`media_items[${key}]`, files[key])
        }
      })

      const response = await api.post(`/church/content-settings/${section}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.status) {
        showToast.success('Content updated successfully')
        await fetchChurchContent() // Refresh content
        return true
      }
      return false
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update content'
      showToast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Get content for a specific section
   */
  function getSectionContent(section) {
    return content.value[section]?.content || {}
  }

  /**
   * Check if section is enabled
   */
  function isSectionEnabled(section) {
    return content.value[section]?.is_enabled ?? true
  }

  /**
   * Clear content
   */
  function clearContent() {
    content.value = {}
    error.value = null
  }

  return {
    // State
    content,
    loading,
    error,

    // Actions
    fetchChurchContent,
    updateSection,
    getSectionContent,
    isSectionEnabled,
    clearContent,
  }
})
