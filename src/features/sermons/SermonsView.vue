<script setup>
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import PageHeader from '@/components/dashboard/PageHeader.vue'
import { BookOpen } from 'lucide-vue-next'
</script>

<template>
  <DashboardLayout>
    <PageHeader
      title="Sermons"
      description="Manage sermon archives and media library"
      :icon="BookOpen"
    />

    <div class="space-y-6">
      <div class="rounded-lg border bg-card p-8 text-center">
        <BookOpen class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">Sermons Library</h3>
        <p class="text-muted-foreground">
          This feature is under development. You'll be able to upload and manage sermons here.
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>
