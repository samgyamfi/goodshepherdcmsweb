<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AdminSidebar from './AdminSidebar.vue'
import DashboardHeader from '@/features/dashboard/components/DashboardHeader.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'

/**
 * Standalone layout shell for all super-admin routes (/admin/**).
 * Uses its own AdminSidebar — completely independent of the church dashboard.
 * No church-context check: super admins reach /admin without a church profile.
 */
const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Sidebar -->
    <Sheet v-model:open="isMobileMenuOpen">
      <SheetContent side="left" class="w-64 p-0">
        <AdminSidebar :is-mobile="true" @navigate="isMobileMenuOpen = false" />
      </SheetContent>
    </Sheet>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <AdminSidebar :is-mobile="false" />
    </aside>

    <!-- Main Content -->
    <div class="md:pl-64">
      <DashboardHeader @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen" />

      <main class="p-4 md:p-6 lg:p-8">
        <!-- Child routes render here (overview, churches, users, etc.) -->
        <RouterView />
      </main>
    </div>
  </div>
</template>
