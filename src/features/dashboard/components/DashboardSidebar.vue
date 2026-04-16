<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useThemeStore } from '@/stores/theme'
import { useChurchStore } from '@/stores/church'
import { useNavigation } from '../composables/useNavigation'
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
import { User, Settings, LogOut, Moon, Sun } from 'lucide-vue-next'
import ChurchSwitcher from './ChurchSwitcher.vue'
import DashboardSwitcher from '@/features/admin/components/DashboardSwitcher.vue'

defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const churchStore = useChurchStore()
const { navigationSections } = useNavigation()

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
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
    <!-- Church Switcher -->
    <div class="border-b p-3">
      <ChurchSwitcher />
    </div>

    <!-- Dashboard Switcher — only rendered (and takes up space) for super admins -->
    <div v-if="authStore.isSuperAdmin" class="border-b p-3">
      <DashboardSwitcher />
    </div>

    <!-- Logo & Church Name -->
    <div class="flex h-16 items-center gap-3 border-b px-4">
      <img
        v-if="churchStore.church?.logo"
        :src="churchStore.church.logo"
        alt="Church Logo"
        class="h-8 w-auto"
      />
      <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
        <span class="text-sm font-bold text-primary-foreground">
          {{ churchStore.churchInitials }}
        </span>
      </div>
      <span class="truncate font-semibold text-foreground">{{
        churchStore.church?.name || 'Church'
      }}</span>
    </div>

    <!-- Navigation Links -->
    <ScrollArea class="flex-1 py-4">
      <nav class="space-y-6 px-3">
        <div v-for="section in navigationSections" :key="section.id" class="space-y-1">
          <!-- Section Label -->
          <p class="mb-2 px-3 text-xs font-medium text-muted-foreground">
            {{ section.label }}
          </p>

          <!-- Section Links -->
          <a
            v-for="link in section.links"
            :key="link.id"
            :href="link.path"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="{
              'bg-accent text-accent-foreground': isActive(link.path),
              'text-muted-foreground': !isActive(link.path),
            }"
            @click.prevent="navigateTo(link.path)"
          >
            <component :is="link.icon" class="h-4 w-4" />
            <span>{{ link.name }}</span>
          </a>
        </div>
      </nav>
    </ScrollArea>

    <!-- User Profile Section -->
    <div class="border-t p-4">
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarImage :src="authStore.user?.profile?.photo_url" />
          <AvatarFallback>{{ authStore.userInitials }}</AvatarFallback>
        </Avatar>

        <div class="flex-1 overflow-hidden">
          <p class="text-sm font-medium text-foreground">{{ authStore.user?.full_name }}</p>
          <p class="truncate text-xs text-muted-foreground">
            {{ authStore.user?.phone || authStore.user?.email || 'User' }}
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
                <p class="text-xs text-muted-foreground">
                  {{ authStore.user?.phone || authStore.user?.email || 'User' }}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="router.push('/profile')">
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push('/dashboard/settings')">
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <Moon v-if="!themeStore.isDark" class="mr-2 h-4 w-4" />
                  <Sun v-else class="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </div>
                <Switch
                  :model-value="themeStore.isDark"
                  @update:model-value="themeStore.toggleTheme"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
