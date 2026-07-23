import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

/**
 * Landing page store with stale-while-revalidate (SWR) caching.
 *
 * On every visit:
 *   - If localStorage cache exists → render immediately, fetch in background
 *   - If no cache → show skeleton until first fetch completes
 *
 * Cache TTL: 30 minutes for default (unauthenticated) data.
 * Authenticated data is always revalidated in background on page load.
 */
export const useLandingPageStore = defineStore(
  'landingPage',
  () => {
    // ─── Persisted state (written to localStorage) ─────────────────────────
    const data = ref(null)
    const cachedAt = ref(null) // ISO timestamp of last successful fetch

    // ─── Transient state (not persisted) ───────────────────────────────────
    const isLoading = ref(false) // true only on cold cache (no data yet)
    const isRevalidating = ref(false) // true when refreshing in background
    const error = ref(null)

    // ─── Cache helpers ─────────────────────────────────────────────────────
    const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes for default data

    const isCacheStale = computed(() => {
      if (!cachedAt.value) return true
      const age = Date.now() - new Date(cachedAt.value).getTime()
      return age > CACHE_TTL_MS
    })

    const hasCachedData = computed(() => !!data.value)

    // ─── Meta ───────────────────────────────────────────────────────────────
    const isDefault = computed(() => data.value?.is_default ?? true)
    const hasChurch = computed(() => !!data.value?.church && !isDefault.value)
    const appConfig = computed(() => data.value?.app ?? {})

    // ─── Section content helpers ────────────────────────────────────────────
    function sectionContent(sectionKey) {
      return computed(() => {
        if (!data.value) return {}
        const setting = data.value.content_settings?.[sectionKey] ?? {}

        return {
          ...(setting.content_urls ?? setting.content ?? {}),
          ...(setting.media_urls ?? {}),
        }
      })
    }

    const heroContent = sectionContent('hero')
    const aboutContent = sectionContent('about')
    const quote = sectionContent('quote')
    const featuredSermon = sectionContent('featured_sermon')

    const ministries = computed(() => sectionContent('ministries').value?.items ?? [])
    const news = computed(() => sectionContent('news').value?.items ?? [])
    const socialLinks = computed(() => sectionContent('social_links').value ?? {})

    const pastors = computed(() => data.value?.pastors ?? [])
    const programs = computed(() => data.value?.programs ?? [])
    const events = computed(() => data.value?.events ?? [])
    const services = computed(() => data.value?.services ?? [])
    const contact = computed(() => data.value?.contact ?? {})

    // ─── Fetch ──────────────────────────────────────────────────────────────
    /**
     * Fetch landing data with SWR semantics.
     *
     * @param {object} options
     * @param {boolean} options.force - Skip cache TTL check and always revalidate
     */
    async function fetchLandingData({ force = false } = {}) {
      // If we already have cached data, revalidate silently in the background
      // unless the cache is stale AND it's default data (auth data always revalidates)
      if (hasCachedData.value) {
        const shouldSkip = !force && !isCacheStale.value && isDefault.value
        if (shouldSkip) return true // Cache is fresh enough, skip the network call
        isRevalidating.value = true
      } else {
        // Cold cache — show a proper loading state
        isLoading.value = true
      }

      error.value = null

      try {
        const response = await api.get('/landing')

        if (response.data.status) {
          data.value = response.data.data
          cachedAt.value = new Date().toISOString()
          return true
        }

        error.value = response.data.message ?? 'Failed to fetch landing data'
        return false
      } catch (err) {
        error.value = err.response?.data?.message ?? 'Failed to fetch landing data'
        return false
      } finally {
        isLoading.value = false
        isRevalidating.value = false
      }
    }

    /**
     * Clear the cached landing data.
     * Call this when the user logs out so the next landing page visit
     * fetches fresh unauthenticated data instead of stale church data.
     */
    function clearCache() {
      data.value = null
      cachedAt.value = null
      error.value = null
    }

    return {
      // Persisted state
      data,
      cachedAt,

      // Transient state
      isLoading,
      isRevalidating,
      error,

      // Derived
      isDefault,
      hasChurch,
      hasCachedData,
      isCacheStale,
      appConfig,

      // Section data
      heroContent,
      aboutContent,
      quote,
      featuredSermon,
      ministries,
      news,
      socialLinks,
      pastors,
      programs,
      events,
      services,
      contact,

      // Actions
      fetchLandingData,
      clearCache,
    }
  },
  {
    persist: {
      key: 'gsag-landing',
      storage: localStorage,
      paths: ['data', 'cachedAt'], // Only persist the response data and its timestamp
    },
  },
)
