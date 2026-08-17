<script setup>
import EventCard from './EventCard.vue'

defineProps({
  events: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
})

defineEmits(['open', 'edit', 'delete'])
</script>

<template>
  <div v-if="loading" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    <div v-for="item in 6" :key="item" class="aspect-[4/3] animate-pulse rounded-md bg-muted" />
  </div>
  <div v-else-if="events.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    <EventCard
      v-for="event in events"
      :key="event.uuid"
      :event="event"
      :can-edit="canEdit"
      :can-delete="canDelete"
      @open="$emit('open', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
  <div v-else class="border-y py-16 text-center">
    <p class="font-medium">No events found</p>
    <p class="mt-1 text-sm text-muted-foreground">Adjust the filters or create the first event.</p>
  </div>
</template>
