/**
 * Pinia Stores
 *
 * This folder contains all Pinia stores for the application.
 * Each feature can have its own store file.
 *
 * Usage in components:
 * import { useAuthStore } from '@/stores/auth'
 * const authStore = useAuthStore()
 */

// Export all stores from here for easy importing
export { useAuthStore } from './auth/auth'
export { useMembersStore } from './members/members'
