<script setup>
import { ref, watch } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  event: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

// Form state
const formData = ref({
  name: '',
  description: '',
  event_date: '',
  event_time: '',
  location: '',
  speaker: '',
  is_active: true,
  display_order: 0,
})

// Watch for event changes (edit mode)
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    formData.value = {
      name: newEvent.name || '',
      description: newEvent.description || '',
      event_date: newEvent.event_date || '',
      event_time: newEvent.event_time || '',
      location: newEvent.location || '',
      speaker: newEvent.speaker || '',
      is_active: newEvent.is_active ?? true,
      display_order: newEvent.display_order || 0,
    }
  } else {
    resetForm()
  }
}, { immediate: true })

/**
 * Reset form to default values
 */
function resetForm() {
  formData.value = {
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    speaker: '',
    is_active: true,
    display_order: 0,
  }
}

/**
 * Handle form submission
 */
function handleSubmit() {
  emit('save', { ...formData.value })
}

/**
 * Handle close
 */
function handleClose() {
  resetForm()
  emit('close')
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="handleClose">
    <SheetContent class="sm:max-w-xl overflow-y-auto">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <Calendar class="h-5 w-5" />
          {{ event ? 'Edit Event' : 'Add New Event' }}
        </SheetTitle>
        <SheetDescription>
          {{ event ? 'Update event information' : 'Add a new event to your church' }}
        </SheetDescription>
      </SheetHeader>

      <div class="space-y-4 py-4">
        <!-- Name -->
        <div class="space-y-2">
          <Label for="name">Event Name *</Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="e.g., Easter Celebration"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Brief description of the event"
            rows="3"
            class="resize-none"
          />
        </div>

        <!-- Date & Time -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="event_date">Event Date *</Label>
            <Input
              id="event_date"
              v-model="formData.event_date"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <Label for="event_time">Event Time</Label>
            <Input
              id="event_time"
              v-model="formData.event_time"
              type="time"
            />
          </div>
        </div>

        <!-- Location & Speaker -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="location">Location</Label>
            <Input
              id="location"
              v-model="formData.location"
              placeholder="e.g., Main Sanctuary"
            />
          </div>

          <div class="space-y-2">
            <Label for="speaker">Speaker</Label>
            <Input
              id="speaker"
              v-model="formData.speaker"
              placeholder="e.g., Pastor John Doe"
            />
          </div>
        </div>

        <!-- Active Status -->
        <div class="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div class="space-y-0.5">
            <Label for="is_active">Active Status</Label>
            <p class="text-xs text-muted-foreground">
              {{ formData.is_active ? 'Event is active' : 'Event is inactive' }}
            </p>
          </div>
          <Switch
            id="is_active"
            v-model="formData.is_active"
          />
        </div>
      </div>

      <SheetFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button
          type="button"
          :disabled="isSaving || !formData.name || !formData.event_date"
          @click="handleSubmit"
        >
          <span v-if="isSaving" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving...
          </span>
          <span v-else>
            {{ event ? 'Update' : 'Create' }} Event
          </span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
