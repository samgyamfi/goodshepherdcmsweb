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
          <h1 class="text-3xl font-bold text-foreground">Transaction Types</h1>
          <p class="text-muted-foreground mt-2">Configure transaction categories</p>
        </div>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          Add Transaction Type
        </Button>
      </div>

      <div class="grid gap-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar />

        <div class="rounded-lg border bg-card p-12">
          <div class="text-center space-y-4">
            <h2 class="text-xl font-semibold text-foreground">Transaction Types Coming Soon</h2>
            <p class="text-muted-foreground">
              This section will include transaction type management for financial operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
