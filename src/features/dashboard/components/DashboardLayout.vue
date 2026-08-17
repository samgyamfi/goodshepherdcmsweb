<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useChurchStore } from '@/stores/church'
import DashboardSidebar from './DashboardSidebar.vue'
import DashboardHeader from './DashboardHeader.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'

const isMobileMenuOpen = ref(false)
const isReady = ref(false)

const churchStore = useChurchStore()
const authStore = useAuthStore()

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

/**
 * Refresh authentication once per page load before fetching extended church
 * data. initializeAuth() deduplicates this call with the router guard, keeping
 * persisted permissions and roles current without duplicate requests.
 */
onMounted(async () => {
  await authStore.initializeAuth()

  if (!Object.keys(churchStore.contentSettings ?? {}).length) {
    await churchStore.fetchChurchData()
  }
  isReady.value = true
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Sidebar (Sheet) -->
    <Sheet v-model:open="isMobileMenuOpen">
      <SheetContent side="left" class="w-64 p-0">
        <DashboardSidebar :is-mobile="true" @navigate="closeMobileMenu" />
      </SheetContent>
    </Sheet>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <DashboardSidebar :is-mobile="false" />
    </aside>

    <!-- Main Content — rendered only after church data is ready -->
    <div v-if="isReady" class="md:pl-64">
      <DashboardHeader @toggle-mobile-menu="toggleMobileMenu" />

      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
