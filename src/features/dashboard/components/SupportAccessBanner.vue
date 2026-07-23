<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Headphones, LogOut } from 'lucide-vue-next'
import { useSupportAccessStore } from '@/stores/supportAccess'
import { useAuthStore } from '@/stores/auth/auth'
import { useConfirm } from '@/composables/useConfirm'

const supportStore = useSupportAccessStore()
const authStore = useAuthStore()
const router = useRouter()
const { confirm } = useConfirm()
const now = ref(Date.now())
let timer = null
let restoring = false

const remainingSeconds = computed(() => {
  const expires = new Date(supportStore.session?.expires_at || 0).getTime()
  return Math.max(0, Math.floor((expires - now.value) / 1000))
})

const remaining = computed(() => {
  const seconds = remainingSeconds.value
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
})

async function restoreExpiredSession() {
  if (restoring || !supportStore.isActive) return

  restoring = true
  await supportStore.restorePlatformContext()
  await router.replace({ name: 'super-admin-dashboard', query: { support: 'expired' } })
}

async function requestEnd() {
  const accepted = await confirm({
    title: 'End church support access?',
    description: `You will return to the system dashboard and leave ${supportStore.session?.church?.name}.`,
    confirmLabel: 'End Support Access',
    cancelLabel: 'Continue Working',
    variant: 'destructive',
  })
  if (!accepted) return

  await supportStore.end()
  router.push({ name: 'super-admin-dashboard' })
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
    if (remainingSeconds.value === 0) restoreExpiredSession()
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <button
    v-if="supportStore.isActive"
    type="button"
    class="flex min-w-0 items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-left text-xs text-amber-800 hover:bg-amber-500/15 dark:text-amber-200"
    @click="requestEnd"
  >
    <Headphones class="h-4 w-4 shrink-0" />
    <span class="truncate">
      Support access: <strong>{{ supportStore.session?.church?.name }}</strong> &middot;
      {{ authStore.fullName }}
    </span>
    <span class="shrink-0 font-semibold tabular-nums">{{ remaining }}</span>
    <LogOut class="h-3.5 w-3.5 shrink-0" />
  </button>
</template>
