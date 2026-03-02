<script setup>
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * DemographicsSection Component
 * Handles demographic information fields for member form
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
    required: true,
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

// Gender options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

// Marital status options
const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Date of Birth & Gender -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="date_of_birth" class="text-sm font-medium">Date of Birth</label>
        <Input
          id="date_of_birth"
          :model-value="formData.date_of_birth"
          type="date"
          @update:model-value="(value) => updateField('date_of_birth', value)"
        />
      </div>
      <div class="space-y-2">
        <label for="gender" class="text-sm font-medium">Gender</label>
        <Select :model-value="formData.gender" @update:model-value="(value) => updateField('gender', value)">
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="option in genderOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Marital Status & Occupation -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="marital_status" class="text-sm font-medium">Marital Status</label>
        <Select :model-value="formData.marital_status" @update:model-value="(value) => updateField('marital_status', value)">
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="option in maritalStatusOptions"
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
        <label for="occupation" class="text-sm font-medium">Occupation</label>
        <Input
          id="occupation"
          :model-value="formData.occupation"
          placeholder="Teacher, Engineer, etc."
          @update:model-value="(value) => updateField('occupation', value)"
        />
      </div>
    </div>

    <!-- WhatsApp Number -->
    <div class="space-y-2">
      <label for="whatsapp_number" class="text-sm font-medium">WhatsApp Number</label>
      <Input
        id="whatsapp_number"
        :model-value="formData.whatsapp_number"
        type="tel"
        placeholder="+233 XX XXX XXXX"
        @update:model-value="(value) => updateField('whatsapp_number', value)"
      />
    </div>
  </div>
</template>
