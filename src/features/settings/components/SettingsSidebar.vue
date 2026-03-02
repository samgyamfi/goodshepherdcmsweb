<script setup>
import { useRouter, useRoute } from 'vue-router'
import { settingsLinks } from '../config/settingsLinks'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, Settings } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

function isActive(path) {
  return route.path === path
}

function navigateTo(path) {
  router.push(path)
}
</script>

<template>
  <div class="rounded-lg border bg-card">
    <div class="p-4 border-b flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Settings class="h-8 w-8" />
        <h3 class="font-semibold text-foreground text-lg">Settings</h3>
      </div>
    </div>

    <ScrollArea class="h-[calc(100vh-16rem)]">
      <div class="p-2">
        <nav class="space-y-1">
          <a
            v-for="link in settingsLinks"
            :key="link.id"
            :href="link.path"
            class="flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="{
              'bg-accent text-accent-foreground': isActive(link.path),
              'text-muted-foreground': !isActive(link.path),
            }"
            @click.prevent="navigateTo(link.path)"
          >
            <component :is="link.icon" class="h-5 w-5 shrink-0 mt-0.5" />
            <div class="flex-1">
              <div class="font-medium">{{ link.name }}</div>
            </div>
            <ChevronRight class="h-4 w-4" />
          </a>
        </nav>
      </div>
    </ScrollArea>
  </div>
</template>
