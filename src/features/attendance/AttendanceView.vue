<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { Calendar } from 'lucide-vue-next'
</script>

<template>
  <DashboardLayout>
    <PageHeader
      title="Attendance"
      description="Track and manage church service attendance records"
      :icon="Calendar"
    />

    <div class="space-y-6">
      <div class="rounded-lg border bg-card p-8 text-center">
        <Calendar class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">Attendance Management</h3>
        <p class="text-muted-foreground">
          This feature is under development. You'll be able to record and analyze attendance data here.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>
