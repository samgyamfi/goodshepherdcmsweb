/**
 * Debounce utility function
 * Delays invoking a function until after wait milliseconds have elapsed
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
  let timeout

  function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  // Cancel a pending invocation
  executedFunction.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return executedFunction
}

/**
 * Throttle utility function
 * Limits a function to be called at most once in a specified time period
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to throttle invocations to
 * @returns {Function} - The throttled function
 */
export function throttle(func, limit) {
  let inThrottle

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
