import { computed } from 'vue'
import { useChurchContentStore } from '@/stores/churchContent'

/**
 * Composable for managing all church CMS content sections.
 * Sections mirror ContentSectionEnum on the backend:
 * hero, about, quote, ministries, featured_sermon, news, social_links
 */
export function useChurchContent() {
  const store = useChurchContentStore()

  const heroContent          = computed(() => store.getSectionContent('hero'))
  const aboutContent         = computed(() => store.getSectionContent('about'))
  const quoteContent         = computed(() => store.getSectionContent('quote'))
  const ministriesContent    = computed(() => store.getSectionContent('ministries'))
  const featuredSermonContent = computed(() => store.getSectionContent('featured_sermon'))
  const newsContent          = computed(() => store.getSectionContent('news'))
  const socialLinksContent   = computed(() => store.getSectionContent('social_links'))

  return {
    // State
    content: store.content,
    loading: store.loading,
    error: store.error,

    // Section computed
    heroContent,
    aboutContent,
    quoteContent,
    ministriesContent,
    featuredSermonContent,
    newsContent,
    socialLinksContent,

    // Actions
    fetchChurchContent: store.fetchChurchContent,
    updateSection: store.updateSection,
    getSectionContent: store.getSectionContent,
    isSectionEnabled: store.isSectionEnabled,
    clearContent: store.clearContent,
  }
}
