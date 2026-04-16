<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: { type: Array, default: () => [] },
})

const upcomingEvents = computed(() => props.events.slice(0, 6))

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <section id="events" class="py-16 lg:py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-slate-900">Upcoming Events</h2>
        <p class="mt-4 text-lg text-slate-600">Join us for these special gatherings</p>
      </div>

      <div v-if="upcomingEvents.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in upcomingEvents" :key="event.id" 
             class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="aspect-video bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span class="text-sm font-medium text-amber-600">{{ formatDate(event.event_date) }}</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">{{ event.name }}</h3>
            <p v-if="event.description" class="mt-2 text-sm text-slate-600 line-clamp-2">{{ event.description }}</p>
            <div v-if="event.event_time || event.location" class="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
              <span v-if="event.event_time" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ event.event_time }}
              </span>
              <span v-if="event.location" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ event.location }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-slate-600">Upcoming events will be displayed here</p>
      </div>
    </div>
  </section>
</template>
