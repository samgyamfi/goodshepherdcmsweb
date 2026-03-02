<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Case Categories</h1>
          <p class="text-muted-foreground mt-2">Manage complaint categories</p>
        </div>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div class="grid gap-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar />

        <div class="rounded-lg border bg-card p-12">
          <div class="text-center space-y-4">
            <h2 class="text-xl font-semibold text-foreground">Case Categories Coming Soon</h2>
            <p class="text-muted-foreground">
              This section will include complaint category management for case organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
