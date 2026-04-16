<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth/auth'
import { Building2, LogOut, RefreshCw, Home } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const isRefreshing = ref(false)

async function refreshMembership() {
  isRefreshing.value = true
  try {
    const ok = await authStore.fetchUser()
    if (ok && authStore.hasActiveChurch) {
      router.replace({ name: 'dashboard' })
    }
  } finally {
    isRefreshing.value = false
  }
}

async function signOut() {
  await authStore.logout()
  router.replace({ name: 'login' })
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6">
    <div class="mb-8">
      <AppLogo />
    </div>

    <Card class="w-full max-w-lg border-border shadow-sm">
      <CardHeader class="space-y-1 text-center pb-2">
        <div
          class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10"
        >
          <Building2 class="h-6 w-6 text-amber-600" />
        </div>
        <CardTitle class="text-xl">No active church</CardTitle>
        <CardDescription class="text-base leading-relaxed">
          You are signed in, but your account is not linked to an active church profile yet. This
          usually means your church administrator has not finished setting you up, or your
          membership is still being processed.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col gap-3 pt-2">
        <p v-if="authStore.fullName" class="text-center text-sm text-muted-foreground">
          Signed in as
          <span class="font-medium text-foreground">{{ authStore.fullName }}</span>
        </p>

        <Button class="w-full" :disabled="isRefreshing" @click="refreshMembership">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRefreshing }" />
          I was added to a church — check again
        </Button>

        <Button variant="outline" class="w-full" @click="goHome">
          <Home class="mr-2 h-4 w-4" />
          Back to home
        </Button>

        <Button variant="ghost" class="w-full text-muted-foreground" @click="signOut">
          <LogOut class="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </CardContent>
    </Card>

    <p class="mt-6 max-w-md text-center text-xs text-muted-foreground">
      If you believe this is a mistake, contact your church office or platform support.
    </p>
  </div>
</template>
