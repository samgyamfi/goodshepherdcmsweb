<script setup>
import { computed } from 'vue'
import EventManager from '@/features/events/components/EventManager.vue'
import { groupEventsService } from '@/features/events/services/eventsService'

const props = defineProps({ group: { type: Object, required: true } })
const service = computed(() => groupEventsService(props.group.uuid))
const canManage = computed(() => props.group.capabilities.manage_schedules && !props.group.is_archived)
</script>

<template>
  <EventManager
    :service="service"
    :can-create="canManage"
    :can-update="canManage"
    :can-delete="canManage"
    title="Group events"
    description="Activities, services, and responsibilities connected to this group."
  />
</template>
