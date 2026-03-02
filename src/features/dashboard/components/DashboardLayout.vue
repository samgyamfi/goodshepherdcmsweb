<script setup>
import { ref } from 'vue'
import DashboardSidebar from './DashboardSidebar.vue'
import DashboardHeader from './DashboardHeader.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
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

    <!-- Main Content -->
    <div class="md:pl-64">
      <DashboardHeader @toggle-mobile-menu="toggleMobileMenu" />

      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
