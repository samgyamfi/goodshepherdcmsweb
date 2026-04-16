import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLandingPageStore } from '@/stores/landingPage'
import { useAuthStore } from '@/stores/auth/auth'

/**
 * Landing page composable.
 *
 * Loading strategy: stale-while-revalidate (SWR)
 * - isLoading: true only when there is no cached data at all (cold first visit)
 * - isRevalidating: true when data is already displayed but a background refresh is in progress
 *
 * The component should use isLoading to decide whether to show a skeleton,
 * and isRevalidating to optionally show a small unobtrusive refresh indicator.
 */
export function useLandingPage() {
  const landingStore = useLandingPageStore()
  const authStore = useAuthStore()

  const {
    isLoading,
    isRevalidating,
    isDefault,
    hasChurch,
    hasCachedData,
    heroContent,
    aboutContent,
    programs,
    events,
    pastors,
    services,
    ministries,
    quote,
    featuredSermon,
    news,
    contact,
    socialLinks,
    appConfig,
  } = storeToRefs(landingStore)

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const showDashboardBtn = computed(() => authStore.isAuthenticated)

  const navLinks = computed(() => [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Events', href: '#events' },
    { name: 'Contact', href: '#contact' },
  ])

  async function initialize() {
    // Authenticated data is always revalidated so church members see fresh content.
    // Default data is only re-fetched if the cache is stale (>30 min).
    await landingStore.fetchLandingData({ force: isAuthenticated.value })
  }

  onMounted(() => {
    initialize()
  })

  return {
    // Loading / meta
    isLoading,
    isRevalidating,
    isDefault,
    hasChurch,
    hasCachedData,
    isAuthenticated,
    showDashboardBtn,

    // Navigation
    navLinks,

    // Section data
    heroContent,
    aboutContent,
    programs,
    events,
    pastors,
    services,
    ministries,
    quote,
    featuredSermon,
    news,
    contact,
    socialLinks,
    appConfig,

    // Actions
    initialize,
  }
}
