<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

/**
 * SpiritualInfoSection Component
 * Handles spiritual information fields for member form
 * 
 * @props {Object} formData - Form data object
 * @props {Object} errors - Validation errors object
 * @emits {Event} update:formData - Emitted when form data changes
 */

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:formData'])

/**
 * Update form data field
 * @param {string} field - Field name to update
 * @param {any} value - New value
 */
function updateField(field, value) {
  emit('update:formData', { ...props.formData, [field]: value })
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date
  }
}

// Membership status options
const membershipStatusOptions = [
  { value: 'active', label: 'Active Member' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'transferred', label: 'Transferred' },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Baptism Status -->
    <div class="flex items-center justify-between space-x-2 rounded-lg border p-3">
      <div class="flex-1 space-y-0.5">
        <label for="is_baptized" class="text-sm font-medium">Is baptized?</label>
        <p class="text-xs text-muted-foreground">Mark if the member has been baptized</p>
      </div>
      <Switch
        id="is_baptized"
        :checked="formData.is_baptized"
        @update:checked="(value) => updateField('is_baptized', value)"
      />
    </div>

    <!-- Baptism Date (shown if baptized) -->
    <div v-if="formData.is_baptized" class="space-y-2">
      <label for="baptism_date" class="text-sm font-medium">Baptism Date</label>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="w-full justify-start text-left font-normal"
            :class="!formData.baptism_date && 'text-muted-foreground'"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ formData.baptism_date ? formatDate(formData.baptism_date) : 'Select date' }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            :model-value="formData.baptism_date"
            @update:model-value="(value) => updateField('baptism_date', value)"
            initial-focus
          />
        </PopoverContent>
      </Popover>
    </div>

    <Separator />

    <!-- Membership Status & Date -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="membership_status" class="text-sm font-medium">Membership Status</label>
        <Select
          :model-value="formData.membership_status"
          @update:model-value="(value) => updateField('membership_status', value)"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="option in membershipStatusOptions"
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
        <label for="membership_date" class="text-sm font-medium">Membership Date</label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              class="w-full justify-start text-left font-normal"
              :class="!formData.membership_date && 'text-muted-foreground'"
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ formData.membership_date ? formatDate(formData.membership_date) : 'Select date' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              :model-value="formData.membership_date"
              @update:model-value="(value) => updateField('membership_date', value)"
              initial-focus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <!-- Spiritual Gifts -->
    <div class="space-y-2">
      <label for="spiritual_gifts" class="text-sm font-medium">Spiritual Gifts</label>
      <textarea
        id="spiritual_gifts"
        :value="formData.spiritual_gifts"
        rows="3"
        placeholder="List spiritual gifts (e.g., teaching, prophecy, healing)"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @input="(event) => updateField('spiritual_gifts', event.target.value)"
      />
    </div>

    <!-- Ministry Interests -->
    <div class="space-y-2">
      <label for="ministry_interests" class="text-sm font-medium">Ministry Interests</label>
      <textarea
        id="ministry_interests"
        :value="formData.ministry_interests"
        rows="3"
        placeholder="List ministries you're interested in serving"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @input="(event) => updateField('ministry_interests', event.target.value)"
      />
    </div>

    <!-- Prayer Requests -->
    <div class="space-y-2">
      <label for="prayer_requests" class="text-sm font-medium">Prayer Requests</label>
      <textarea
        id="prayer_requests"
        :value="formData.prayer_requests"
        rows="3"
        placeholder="Share any prayer requests"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @input="(event) => updateField('prayer_requests', event.target.value)"
      />
    </div>
  </div>
</template>
