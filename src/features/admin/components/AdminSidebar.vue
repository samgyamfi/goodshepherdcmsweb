<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useThemeStore } from '@/stores/theme'
import { adminNavigationSections } from '../config/adminNavigationLinks'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck, User, Settings, LogOut, Moon, Sun } from 'lucide-vue-next'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

function isActive(link) {
  return link.exact
    ? route.path === link.path
    : route.path === link.path || route.path.startsWith(link.path + '/')
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}

function navigateTo(path) {
  router.push(path)
  emit('navigate')
}
</script>

<template>
  <div class="flex h-full flex-col border-r bg-background">
    <!-- ── Admin Branding ─────────────────────────────────────────── -->
    <div class="flex h-16 items-center gap-3 border-b px-4">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
        <ShieldCheck class="h-5 w-5 text-amber-500" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-foreground leading-tight truncate">System Admin</p>
        <p class="text-xs text-muted-foreground leading-tight">Administration Panel</p>
      </div>
    </div>

    <!-- ── Dashboard Switcher (only if super_admin has a church) ──── -->

    <!-- ── Navigation ────────────────────────────────────────────── -->
    <ScrollArea class="flex-1 py-4">
      <nav class="space-y-5 px-3">
        <div v-for="section in adminNavigationSections" :key="section.id" class="space-y-1">
          <p
            class="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70"
          >
            {{ section.label }}
          </p>

          <a
            v-for="link in section.links"
            :key="link.id"
            :href="link.path"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="isActive(link) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
            @click.prevent="navigateTo(link.path)"
          >
            <component :is="link.icon" class="h-4 w-4 shrink-0" />
            <span>{{ link.name }}</span>
          </a>
        </div>
      </nav>
    </ScrollArea>

    <!-- ── User Profile ───────────────────────────────────────────── -->
    <div class="border-t p-4">
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarImage :src="authStore.user?.profile?.photo_url" />
          <AvatarFallback>{{ authStore.userInitials }}</AvatarFallback>
        </Avatar>

        <div class="flex-1 overflow-hidden">
          <p class="text-sm font-medium text-foreground truncate">
            {{ authStore.user?.full_name }}
          </p>
          <p class="text-xs text-muted-foreground truncate">
            {{ authStore.user?.email || authStore.user?.phone || 'Super Admin' }}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
              <Settings class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium">{{ authStore.user?.full_name }}</p>
                <p class="text-xs text-muted-foreground truncate">
                  {{ authStore.user?.email || authStore.user?.phone }}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="router.push('/profile')">
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <component :is="themeStore.isDark ? Sun : Moon" class="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </div>
                <Switch
                  :model-value="themeStore.isDark"
                  @update:model-value="themeStore.toggleTheme"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
