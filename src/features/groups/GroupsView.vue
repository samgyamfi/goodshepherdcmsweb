<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { UsersRound } from 'lucide-vue-next'
</script>

<template>
  <DashboardLayout>
    <PageHeader
      title="Small Groups"
      description="Manage church small groups and cell meetings"
      :icon="UsersRound"
    />

    <div class="space-y-6">
      <div class="rounded-lg border bg-card p-8 text-center">
        <UsersRound class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">Small Groups Management</h3>
        <p class="text-muted-foreground">
          This feature is under development. You'll be able to organize and track small groups here.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>
