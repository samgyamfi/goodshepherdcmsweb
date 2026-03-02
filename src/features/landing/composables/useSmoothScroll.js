import { ref } from 'vue'

/**
 * Composable for smooth scroll navigation
 * Handles scrolling to anchor links with offset for fixed header
 */
export function useSmoothScroll() {
  const mobileOpen = ref(false)

  /**
   * Smoothly scroll to a section
   * @param event - Click event
   * @param href - Target href (e.g., '#about')
   */
  function scrollTo(event, href) {
    event.preventDefault()

    // Close mobile menu if open
    mobileOpen.value = false

    // Scroll to top for home link
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Get target element
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const navHeight = 80 // Account for sticky nav height
      const targetPosition = targetElement.offsetTop - navHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobile() {
    mobileOpen.value = !mobileOpen.value
  }

  /**
   * Close mobile menu
   */
  function closeMobile() {
    mobileOpen.value = false
  }

  return {
    mobileOpen,
    scrollTo,
    toggleMobile,
    closeMobile
  }
}
