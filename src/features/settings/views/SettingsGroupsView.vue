<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Groups</h1>
        </div>
      </div>
      <div class="grid gap-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar />
        <div class="rounded-lg border bg-card p-12">
          <div class="text-center space-y-4">
            <h2 class="text-xl font-semibold text-foreground">Groups Coming Soon</h2>
            <p class="text-muted-foreground">
              This section will include group management for the church ministry and small groups.
            </p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
