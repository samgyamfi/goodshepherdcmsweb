import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updateGlobalOptions } from 'vue3-toastify'

/**
 * Theme Store
 * Manages dark/light mode with automatic persistence
 */
export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false)

    /**
     * Toggle between dark and light mode
     */
    function toggleTheme() {
      isDark.value = !isDark.value
      updateThemeClass()
      updateToastTheme()
    }

    /**
     * Set theme to dark mode
     */
    function setDarkMode() {
      isDark.value = true
      updateThemeClass()
      updateToastTheme()
    }

    /**
     * Set theme to light mode
     */
    function setLightMode() {
      isDark.value = false
      updateThemeClass()
      updateToastTheme()
    }

    /**
     * Update the HTML element class based on theme
     */
    function updateThemeClass() {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    /**
     * Update toast theme to match app theme
     */
    function updateToastTheme() {
      updateGlobalOptions({
        theme: isDark.value ? 'dark' : 'light',
      })
    }

    /**
     * Initialize theme on app mount
     */
    function initTheme() {
      updateThemeClass()
      updateToastTheme()
    }

    return {
      // State
      isDark,

      // Actions
      toggleTheme,
      setDarkMode,
      setLightMode,
      initTheme,
    }
  },
  {
    persist: {
      key: 'gsag-theme',
      storage: localStorage,
      paths: ['isDark'],
    },
  },
)
