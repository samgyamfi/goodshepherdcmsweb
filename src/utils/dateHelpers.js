/**
 * Date formatting utilities
 * Provides consistent date formatting throughout the app
 */

/**
 * Format date range for display
 * @param {Object} range - Date range object with 'from' and 'to' properties
 * @returns {string} Formatted date range string
 */
export function formatDateRange(range) {
  const start = range?.from ?? range?.start
  const end = range?.to ?? range?.end

  if (!start) return 'Select date range'

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  if (!end || start.getTime() === end.getTime()) {
    return formatter.format(start)
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`
}

/**
 * Get current month name
 * @returns {string} Current month name (e.g., "January")
 */
export function getCurrentMonth() {
  return new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(new Date())
}

/**
 * Format a single date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
