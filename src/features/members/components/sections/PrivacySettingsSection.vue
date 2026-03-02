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

/**
 * PrivacySettingsSection Component
 * Handles privacy settings and status fields for member form
 * 
 * @props {Object} formData - Form data object
 * @props {Object} errors - Validation errors object
 * @props {Boolean} canManageStatus - Whether user can manage member status
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
  canManageStatus: {
    type: Boolean,
    default: false,
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

// Status options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'inactive', label: 'Inactive' },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Privacy Toggle -->
    <div class="flex items-center justify-between space-x-2 rounded-lg border p-3">
      <div class="flex-1 space-y-0.5">
        <label for="privacy_share_contact" class="text-sm font-medium">
          Share Contact Information
        </label>
        <p class="text-xs text-muted-foreground">
          Allow other members to see your contact details
        </p>
      </div>
      <Switch
        id="privacy_share_contact"
        :checked="formData.share_contact_info"
        @update:checked="(value) => updateField('share_contact_info', value)"
      />
    </div>

    <!-- Status (only if canManageStatus) -->
    <div v-if="canManageStatus" class="space-y-2">
      <label for="status" class="text-sm font-medium">Member Status</label>
      <Select
        :model-value="formData.status"
        @update:model-value="(value) => updateField('status', value)"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p v-if="errors.status" class="text-xs text-destructive">
        {{ errors.status }}
      </p>
      <p class="text-xs text-muted-foreground">
        Set the member's current status in the church
      </p>
    </div>
  </div>
</template>
