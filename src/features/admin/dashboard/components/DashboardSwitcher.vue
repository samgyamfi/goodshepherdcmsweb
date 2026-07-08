<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, ShieldCheck, ArrowLeftRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const isInAdminDashboard = computed(() =>
  route.path.startsWith('/admin') || route.path.startsWith('/super-admin'),
)

function switchToAdmin() {
  router.push('/super-admin/dashboard')
}
function switchToChurch() {
  router.push('/dashboard')
}
</script>

<template>
  <div v-if="isSuperAdmin" class="space-y-2">
    <!-- Active dashboard badge -->
    <div class="flex items-center gap-2 px-1">
      <component
        :is="isInAdminDashboard ? ShieldCheck : LayoutDashboard"
        class="h-3.5 w-3.5 shrink-0"
        :class="isInAdminDashboard ? 'text-amber-500' : 'text-primary'"
      />
      <span class="text-xs font-medium text-muted-foreground">
        {{ isInAdminDashboard ? 'System Dashboard' : 'Church Dashboard' }}
      </span>
      <Badge
        variant="outline"
        class="ml-auto text-[10px] px-1.5 py-0"
        :class="
          isInAdminDashboard ? 'border-amber-400 text-amber-600' : 'border-primary text-primary'
        "
      >
        Active
      </Badge>
    </div>

    <!-- Switch button -->
    <Button
      variant="ghost"
      size="sm"
      class="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
      @click="isInAdminDashboard ? switchToChurch() : switchToAdmin()"
    >
      <ArrowLeftRight class="h-3.5 w-3.5 shrink-0" />
      {{ isInAdminDashboard ? 'Switch to Church Dashboard' : 'Switch to System Dashboard' }}
    </Button>
  </div>
</template>
