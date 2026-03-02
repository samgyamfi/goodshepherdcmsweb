<script setup>
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

/**
 * LocationInfoSection Component
 * Handles location information fields for member form
 * 
 * @props {Object} formData - Form data object
 * @props {Object} errors - Validation errors object
 * @props {Array} countries - List of countries
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
  countries: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:formData'])

// Country search state
const countrySearch = ref('')
const isCountryPopoverOpen = ref(false)

/**
 * Filtered countries based on search
 */
const filteredCountries = computed(() => {
  if (!countrySearch.value) return props.countries
  return props.countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.value.toLowerCase())
  )
})

/**
 * Update form data field
 * @param {string} field - Field name to update
 * @param {any} value - New value
 */
function updateField(field, value) {
  emit('update:formData', { ...props.formData, [field]: value })
}

/**
 * Select country from popover
 * @param {string} country - Selected country
 */
function selectCountry(country) {
  updateField('country', country)
  countrySearch.value = ''
  isCountryPopoverOpen.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Address Fields -->
    <div class="space-y-2">
      <label for="address" class="text-sm font-medium">Address</label>
      <Input
        id="address"
        :model-value="formData.address"
        placeholder="Street address"
        @update:model-value="(value) => updateField('address', value)"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label for="digital_address" class="text-sm font-medium">Digital Address</label>
        <Input
          id="digital_address"
          :model-value="formData.digital_address"
          placeholder="GH-XXX-XXXX"
          @update:model-value="(value) => updateField('digital_address', value)"
        />
      </div>
      <div class="space-y-2">
        <label for="city" class="text-sm font-medium">City</label>
        <Input
          id="city"
          :model-value="formData.city"
          placeholder="Accra"
          @update:model-value="(value) => updateField('city', value)"
        />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="space-y-2">
        <label for="state" class="text-sm font-medium">State/Region</label>
        <Input
          id="state"
          :model-value="formData.state"
          placeholder="Greater Accra"
          @update:model-value="(value) => updateField('state', value)"
        />
      </div>
      <div class="space-y-2">
        <label for="postal_code" class="text-sm font-medium">Postal Code</label>
        <Input
          id="postal_code"
          :model-value="formData.postal_code"
          placeholder="00233"
          @update:model-value="(value) => updateField('postal_code', value)"
        />
      </div>
      <div class="space-y-2">
        <label for="country" class="text-sm font-medium">Country</label>
        <Popover v-model:open="isCountryPopoverOpen">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              class="w-full justify-start"
              :class="!formData.country && 'text-muted-foreground'"
            >
              {{ formData.country || 'Select country' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <div class="p-2">
              <Input
                :model-value="countrySearch"
                placeholder="Search country..."
                class="h-9"
                @update:model-value="(value) => countrySearch = value"
              />
            </div>
            <div class="max-h-[200px] overflow-y-auto">
              <div
                v-for="country in filteredCountries"
                :key="country"
                class="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                @click="selectCountry(country)"
              >
                {{ country }}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
</template>
