<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-vue-next'

/**
 * PersonalInfoSection Component
 * Handles personal information fields for member form
 * 
 * @props {Object} formData - Form data object
 * @props {Object} errors - Validation errors object
 * @props {Boolean} isEditMode - Whether form is in edit mode
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
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:formData'])

// Password visibility state
const showPassword = ref(false)
const showConfirmPassword = ref(false)

/**
 * Update form data field
 * @param {string} field - Field name to update
 * @param {any} value - New value
 */
function updateField(field, value) {
  emit('update:formData', { ...props.formData, [field]: value })
}

/**
 * Toggle password visibility
 */
function togglePassword() {
  showPassword.value = !showPassword.value
}

/**
 * Toggle confirm password visibility
 */
function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <div class="space-y-4">
    <!-- Name Fields -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="first_name" class="text-sm font-medium">
          First Name <span class="text-destructive">*</span>
        </label>
        <Input
          id="first_name"
          :model-value="formData.first_name"
          placeholder="John"
          :class="{ 'border-destructive': errors.first_name }"
          @update:model-value="(value) => updateField('first_name', value)"
        />
        <p v-if="errors.first_name" class="text-xs text-destructive">
          {{ errors.first_name }}
        </p>
      </div>
      <div class="space-y-2">
        <label for="last_name" class="text-sm font-medium">
          Last Name <span class="text-destructive">*</span>
        </label>
        <Input
          id="last_name"
          :model-value="formData.last_name"
          placeholder="Doe"
          :class="{ 'border-destructive': errors.last_name }"
          @update:model-value="(value) => updateField('last_name', value)"
        />
        <p v-if="errors.last_name" class="text-xs text-destructive">
          {{ errors.last_name }}
        </p>
      </div>
    </div>

    <!-- Contact Fields -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="phone" class="text-sm font-medium">
          Phone <span class="text-destructive">*</span>
        </label>
        <Input
          id="phone"
          :model-value="formData.phone"
          type="tel"
          placeholder="+233 XX XXX XXXX"
          :class="{ 'border-destructive': errors.phone }"
          @update:model-value="(value) => updateField('phone', value)"
        />
        <p v-if="errors.phone" class="text-xs text-destructive">
          {{ errors.phone }}
        </p>
      </div>
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">
          Email <span class="text-destructive">*</span>
        </label>
        <Input
          id="email"
          :model-value="formData.email"
          type="email"
          placeholder="john@example.com"
          :class="{ 'border-destructive': errors.email }"
          @update:model-value="(value) => updateField('email', value)"
        />
        <p v-if="errors.email" class="text-xs text-destructive">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <!-- Password Fields (Create Mode Only) -->
    <template v-if="!isEditMode">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">
            Password <span class="text-destructive">*</span>
          </label>
          <div class="relative">
            <Input
              id="password"
              :model-value="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="{ 'border-destructive': errors.password }"
              @update:model-value="(value) => updateField('password', value)"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="togglePassword"
            >
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </button>
          </div>
          <p v-if="errors.password" class="text-xs text-destructive">
            {{ errors.password }}
          </p>
        </div>
        <div class="space-y-2">
          <label for="password_confirmation" class="text-sm font-medium">
            Confirm Password <span class="text-destructive">*</span>
          </label>
          <div class="relative">
            <Input
              id="password_confirmation"
              :model-value="formData.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="{ 'border-destructive': errors.password_confirmation }"
              @update:model-value="(value) => updateField('password_confirmation', value)"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="toggleConfirmPassword"
            >
              <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </button>
          </div>
          <p v-if="errors.password_confirmation" class="text-xs text-destructive">
            {{ errors.password_confirmation }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
