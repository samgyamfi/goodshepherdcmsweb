<script setup>
import { computed, ref, watch } from 'vue'
import { CalendarDays, Clock3, Download, FileText, MapPin, UserRound, Users } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFileUploads } from '@/composables/useFileUploads'
import EventMediaCarousel from './EventMediaCarousel.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  eventUuid: { type: String, default: '' },
  service: { type: Object, required: true },
})

const emit = defineEmits(['update:open'])
const event = ref(null)
const loading = ref(false)
const { download } = useFileUploads()
const attendance = computed(() => event.value?.expected_attendance || event.value?.capacity)

async function load() {
  if (!props.open || !props.eventUuid) return
  loading.value = true
  try {
    const response = await props.service.show(props.eventUuid)
    event.value = response.data.data.event
  } finally {
    loading.value = false
  }
}

watch(() => [props.open, props.eventUuid], load)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="w-[96vw] max-w-6xl overflow-hidden p-0">
      <div v-if="loading" class="h-[70vh] animate-pulse bg-muted" />
      <template v-else-if="event">
        <EventMediaCarousel :images="event.media?.images || []" :name="event.name" />
        <div class="space-y-7 p-5 sm:p-7 lg:p-9">
          <DialogHeader class="text-left">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <Badge v-if="event.category" variant="secondary">{{ event.category.name }}</Badge>
              <Badge>{{ event.status_label }}</Badge>
              <Badge v-if="event.group" variant="outline">{{ event.group.name }}</Badge>
            </div>
            <DialogTitle class="text-2xl sm:text-3xl">{{ event.name }}</DialogTitle>
            <DialogDescription v-if="event.speaker">Hosted by {{ event.speaker }}</DialogDescription>
          </DialogHeader>

          <div class="grid gap-7 lg:grid-cols-[1.4fr_0.8fr]">
            <div class="space-y-7">
              <section v-if="event.description" class="space-y-2">
                <h3 class="font-semibold">About this event</h3>
                <div class="prose prose-sm max-w-none text-muted-foreground dark:prose-invert" v-html="event.description" />
              </section>
              <section v-if="event.media?.documents?.length" class="space-y-3">
                <h3 class="font-semibold">Attachments</h3>
                <button
                  v-for="file in event.media.documents"
                  :key="file.uuid"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-md border p-3 text-left hover:bg-muted"
                  @click="download(file)"
                >
                  <FileText class="h-5 w-5 text-muted-foreground" />
                  <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ file.filename }}</span>
                  <span class="text-xs text-muted-foreground">{{ file.size_human }}</span>
                  <Download class="h-4 w-4" />
                </button>
              </section>
            </div>

            <aside class="space-y-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <h3 class="font-semibold">Schedule and location</h3>
              <dl class="space-y-4 text-sm">
                <div class="flex gap-3"><CalendarDays class="mt-0.5 h-4 w-4 text-primary" /><div><dt class="font-medium">Date</dt><dd class="text-muted-foreground">{{ event.event_date_label }}</dd></div></div>
                <div v-if="event.event_time_label" class="flex gap-3"><Clock3 class="mt-0.5 h-4 w-4 text-primary" /><div><dt class="font-medium">Time</dt><dd class="text-muted-foreground">{{ event.event_time_label }}</dd></div></div>
                <div v-if="event.location" class="flex gap-3"><MapPin class="mt-0.5 h-4 w-4 text-primary" /><div><dt class="font-medium">Location</dt><dd class="text-muted-foreground">{{ event.location }}<span v-if="event.digital_address" class="block">{{ event.digital_address }}</span></dd></div></div>
                <div v-if="event.speaker" class="flex gap-3"><UserRound class="mt-0.5 h-4 w-4 text-primary" /><div><dt class="font-medium">Speaker</dt><dd class="text-muted-foreground">{{ event.speaker }}</dd></div></div>
                <div v-if="attendance" class="flex gap-3"><Users class="mt-0.5 h-4 w-4 text-primary" /><div><dt class="font-medium">Participation</dt><dd class="text-muted-foreground">{{ event.expected_attendance || 0 }} expected<span v-if="event.capacity"> · {{ event.capacity }} capacity</span></dd></div></div>
              </dl>
              <section v-if="event.is_recurring || event.requires_rsvp" class="space-y-2 border-t pt-5">
                <h3 class="font-semibold">Participation</h3>
                <p v-if="event.is_recurring" class="text-sm text-muted-foreground">This event follows a recurring schedule.</p>
                <p v-if="event.requires_rsvp" class="text-sm text-muted-foreground">Attendees are required to RSVP.</p>
              </section>
            </aside>
          </div>
        </div>
      </template>
    </DialogScrollContent>
  </Dialog>
</template>
