<script setup>
import { CalendarDays, Clock3, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EventMediaCarousel from './EventMediaCarousel.vue'

defineProps({
  event: { type: Object, required: true },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
})

defineEmits(['open', 'edit', 'delete'])
</script>

<template>
  <article
    class="group overflow-hidden rounded-md border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    tabindex="0"
    role="button"
    @click="$emit('open', event)"
    @keydown.enter="$emit('open', event)"
  >
    <EventMediaCarousel :images="event.images || []" :name="event.name" compact />
    <div class="space-y-4 p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <Badge v-if="event.category" variant="secondary" class="mb-2">
            {{ event.category.name }}
          </Badge>
          <h3 class="line-clamp-2 text-base font-semibold">{{ event.name }}</h3>
        </div>
        <DropdownMenu v-if="canEdit || canDelete">
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="ghost" title="Event actions" @click.stop>
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" @click.stop>
            <DropdownMenuItem v-if="canEdit" @click="$emit('edit', event)">
              <Pencil class="mr-2 h-4 w-4" /> Edit event
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="canDelete"
              class="text-destructive"
              @click="$emit('delete', event)"
            >
              <Trash2 class="mr-2 h-4 w-4" /> Delete event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div class="space-y-2 text-sm text-muted-foreground">
        <p class="flex items-center gap-2"><CalendarDays class="h-4 w-4" />{{ event.event_date_label }}</p>
        <p v-if="event.event_time_label" class="flex items-center gap-2"><Clock3 class="h-4 w-4" />{{ event.event_time_label }}</p>
        <p v-if="event.location" class="flex items-center gap-2"><MapPin class="h-4 w-4" />{{ event.location }}</p>
      </div>
    </div>
  </article>
</template>
