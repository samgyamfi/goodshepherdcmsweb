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
import { TimePicker } from '@/components/ui/time-picker'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  program: {
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
  schedule: '',
  day_of_week: '',
  time: '',
  location: '',
  leader: '',
  is_active: true,
  display_order: 0,
})

// Day of week options
const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
]

// Watch for program changes (edit mode)
watch(
  () => props.program,
  (newProgram) => {
    if (newProgram) {
      formData.value = {
        name: newProgram.name || '',
        description: newProgram.description || '',
        schedule: newProgram.schedule || '',
        day_of_week: newProgram.day_of_week || '',
        time: newProgram.time || '',
        location: newProgram.location || '',
        leader: newProgram.leader || '',
        is_active: newProgram.is_active ?? true,
        display_order: newProgram.display_order || 0,
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

/**
 * Reset form to default values
 */
function resetForm() {
  formData.value = {
    name: '',
    description: '',
    schedule: '',
    day_of_week: '',
    time: '',
    location: '',
    leader: '',
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
    <SheetContent side="right" class="w-[95vw] overflow-y-auto sm:max-w-2xl lg:max-w-3xl">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <Calendar class="h-5 w-5" />
          {{ program ? 'Edit Program' : 'Add New Program' }}
        </SheetTitle>
        <SheetDescription>
          {{ program ? 'Update program information' : 'Add a new program to your church' }}
        </SheetDescription>
      </SheetHeader>

      <div class="space-y-4 py-4">
        <!-- Name -->
        <div class="space-y-2">
          <Label for="name">Program Name *</Label>
          <Input id="name" v-model="formData.name" placeholder="e.g., Sunday Service" />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Brief description of the program"
            rows="3"
            class="resize-none"
          />
        </div>

        <!-- Schedule -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="day_of_week">Day of Week</Label>
            <Select v-model="formData.day_of_week">
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Days</SelectLabel>
                  <SelectItem
                    v-for="option in dayOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="time">Time</Label>
            <TimePicker id="time" v-model="formData.time" placeholder="Select program time" />
          </div>
        </div>

        <!-- Schedule Text -->
        <div class="space-y-2">
          <Label for="schedule">Schedule Notes</Label>
          <Input
            id="schedule"
            v-model="formData.schedule"
            placeholder="e.g., Weekly, Bi-weekly, Monthly"
          />
        </div>

        <!-- Location & Leader -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="location">Location</Label>
            <Input id="location" v-model="formData.location" placeholder="e.g., Main Sanctuary" />
          </div>

          <div class="space-y-2">
            <Label for="leader">Leader</Label>
            <Input id="leader" v-model="formData.leader" placeholder="e.g., Pastor John Doe" />
          </div>
        </div>

        <!-- Active Status -->
        <div class="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div class="space-y-0.5">
            <Label for="is_active">Active Status</Label>
            <p class="text-xs text-muted-foreground">
              {{ formData.is_active ? 'Program is active' : 'Program is inactive' }}
            </p>
          </div>
          <Switch id="is_active" v-model="formData.is_active" />
        </div>
      </div>

      <SheetFooter>
        <Button type="button" variant="outline" @click="handleClose"> Cancel </Button>
        <Button type="button" :disabled="isSaving || !formData.name" @click="handleSubmit">
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
          <span v-else> {{ program ? 'Update' : 'Create' }} Program </span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
