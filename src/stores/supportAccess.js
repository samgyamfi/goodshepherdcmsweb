import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth/auth'
import { useChurchStore } from '@/stores/church'

const TOKEN_KEY = 'gsag-support-token'
const SESSION_KEY = 'gsag-support-session'

export const useSupportAccessStore = defineStore('supportAccess', () => {
  const token = ref(sessionStorage.getItem(TOKEN_KEY))
  const session = ref(JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'))
  const loading = ref(false)

  const isActive = computed(() => !!token.value && !!session.value)

  async function fetchOptions() {
    const response = await api.get('/admin/support-sessions/options')
    return response.data.data
  }

  async function start(churchUuid, durationMinutes) {
    loading.value = true
    try {
      const response = await api.post('/admin/support-sessions', {
        church_uuid: churchUuid,
        duration_minutes: durationMinutes,
      })
      return response.data.data
    } finally {
      loading.value = false
    }
  }

  async function verify(sessionUuid, code) {
    loading.value = true
    try {
      const response = await api.post(`/admin/support-sessions/${sessionUuid}/verify`, { code })
      setSupportData(response.data.data)
      await useAuthStore().fetchUser()
      seedChurch()
      return true
    } finally {
      loading.value = false
    }
  }

  async function resend(sessionUuid) {
    const response = await api.post(`/admin/support-sessions/${sessionUuid}/resend`)
    return response.data.data
  }

  async function end() {
    try {
      await api.delete('/admin/support-sessions/current')
    } finally {
      await restorePlatformContext()
    }
  }

  function setSupportData(data) {
    token.value = data.token
    session.value = data.session
    sessionStorage.setItem(TOKEN_KEY, token.value)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.value))
  }

  function clear() {
    token.value = null
    session.value = null
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  }

  async function restorePlatformContext() {
    clear()
    useChurchStore().clearChurchData()
    await useAuthStore().fetchUser()
  }

  function seedChurch() {
    const church = useAuthStore().user?.support_session?.church
    if (church) useChurchStore().church = church
  }

  return {
    token,
    session,
    loading,
    isActive,
    fetchOptions,
    start,
    verify,
    resend,
    end,
    clear,
    restorePlatformContext,
  }
})
