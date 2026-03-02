<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { Users2 } from 'lucide-vue-next'
</script>

<template>
  <DashboardLayout>
    <PageHeader
      title="Ministries"
      description="Manage church ministries and departments"
      :icon="Users2"
    />

    <div class="space-y-6">
      <div class="rounded-lg border bg-card p-8 text-center">
        <Users2 class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">Ministries Management</h3>
        <p class="text-muted-foreground">
          This feature is under development. You'll be able to manage all church ministries here.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>
