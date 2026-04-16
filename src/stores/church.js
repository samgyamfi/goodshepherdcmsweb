import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useChurchStore = defineStore(
  'church',
  () => {
    // State
    const church = ref(null)
    const contentSettings = ref({})
    const services = ref([])
    const pastors = ref([])
    const isLoading = ref(false)
    const userProfiles = ref([])

    // Computed
    const currentChurchId = computed(() => church.value?.id)
    const currentChurchName = computed(() => church.value?.name)
    const churchInitials = computed(() => {
      if (!church.value?.short_name) return 'C'
      return church.value.short_name.charAt(0).toUpperCase()
    })
    const heroContent = computed(() => contentSettings.value.hero?.content || {})
    const aboutContent = computed(() => contentSettings.value.about?.content || {})
    const programsContent = computed(() => contentSettings.value.programs?.content || {})
    const eventsContent = computed(() => contentSettings.value.events?.content || {})

    // Actions
    async function fetchChurchData() {
      isLoading.value = true
      try {
        const response = await api.get('/church/current')

        if (response.data.status) {
          church.value = response.data.data.church
          contentSettings.value = response.data.data.content_settings || {}
          services.value = response.data.data.services || []
          pastors.value = response.data.data.pastors || []
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to fetch church data:', error)
        return false
      } finally {
        isLoading.value = false
      }
    }

    async function fetchUserProfiles() {
      try {
        const response = await api.get('/user/profiles')

        if (response.data.status) {
          userProfiles.value = response.data.data.profiles || []
          return userProfiles.value
        }
        return []
      } catch (error) {
        console.error('Failed to fetch user profiles:', error)
        return []
      }
    }

    async function setActiveProfile(profileId) {
      try {
        const response = await api.post('/user/profiles/set-active', {
          profile_id: profileId,
        })

        if (response.data.status) {
          church.value = response.data.data.church
          await fetchChurchData()
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to set active profile:', error)
        return false
      }
    }

    async function fetchLandingPageData(churchUuid) {
      isLoading.value = true
      try {
        const response = await api.get(`/church/${churchUuid}/landing`)

        if (response.data.status) {
          church.value = response.data.data.church
          contentSettings.value = response.data.data.content_settings || {}
          services.value = response.data.data.services || []
          pastors.value = response.data.data.pastors || []
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to fetch landing page data:', error)
        return false
      } finally {
        isLoading.value = false
      }
    }

    function clearChurchData() {
      church.value = null
      contentSettings.value = {}
      services.value = []
      pastors.value = []
    }

    return {
      // State
      church,
      contentSettings,
      services,
      pastors,
      isLoading,
      userProfiles,

      // Computed
      currentChurchId,
      currentChurchName,
      churchInitials,
      heroContent,
      aboutContent,
      programsContent,
      eventsContent,

      // Actions
      fetchChurchData,
      fetchUserProfiles,
      setActiveProfile,
      fetchLandingPageData,
      clearChurchData,
    }
  },
  {
    persist: {
      key: 'gsag-church-data',
      storage: localStorage,
      paths: ['church', 'contentSettings'],
    },
  },
)
