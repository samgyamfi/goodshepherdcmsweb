<script setup>
import { computed } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth/auth'
import EventManager from './components/EventManager.vue'
import { eventsService } from './services/eventsService'

const authStore = useAuthStore()
const canCreate = computed(() => authStore.can('events.create'))
const canUpdate = computed(() => authStore.can('events.update'))
const canDelete = computed(() => authStore.can('events.delete'))
</script>

<template>
  <DashboardLayout>
    <EventManager
      :service="eventsService"
      :can-create="canCreate"
      :can-update="canUpdate"
      :can-delete="canDelete"
      title="Church events"
      description="Plan, publish, and review services, gatherings, and church-wide activities."
    />
  </DashboardLayout>
</template>
