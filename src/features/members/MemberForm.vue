<script setup>
import { useMemberForm } from '../composables/useMemberForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Section components
import PersonalInfoSection from './components/sections/PersonalInfoSection.vue'
import DemographicsSection from './components/sections/DemographicsSection.vue'
import LocationInfoSection from './components/sections/LocationInfoSection.vue'
import SpiritualInfoSection from './components/sections/SpiritualInfoSection.vue'
import GroupsSection from './components/sections/GroupsSection.vue'
import PrivacySettingsSection from './components/sections/PrivacySettingsSection.vue'

const props = defineProps({
  member: {
    type: Object,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Initialize form composable
const {
  formData,
  errors,
  isSubmitting,
  submitForm,
} = useMemberForm(props.member, props.isEditMode)

// Countries list (common countries)
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua',
  'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
]

// Handle form submission
async function handleSubmit() {
  const success = await submitForm()
  if (success) {
    emit('submit', formData)
  }
}

// Handle cancel
function handleCancel() {
  emit('cancel')
}

// Update form data from section components
function updateFormData(updates) {
  Object.keys(updates).forEach((key) => {
    formData[key] = updates[key]
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Form Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-foreground">
          {{ isEditMode ? 'Edit Member' : 'Create New Member' }}
        </h2>
        <p class="text-muted-foreground mt-1">
          {{ isEditMode ? 'Update member information' : 'Add a new member to the church' }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Left Column - Personal Information -->
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the member</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Personal Info Section -->
            <PersonalInfoSection
              :form-data="formData"
              :errors="errors"
              :is-edit-mode="isEditMode"
              @update:formData="updateFormData"
            />

            <Separator />

            <!-- Demographics Section -->
            <DemographicsSection
              :form-data="formData"
              :errors="errors"
              @update:formData="updateFormData"
            />

            <Separator />

            <!-- Location Info Section -->
            <LocationInfoSection
              :form-data="formData"
              :errors="errors"
              :countries="countries"
              @update:formData="updateFormData"
            />
          </CardContent>
        </Card>

        <!-- Right Column - Spiritual & Church Info -->
        <Card>
          <CardHeader>
            <CardTitle>Spiritual & Church Information</CardTitle>
            <CardDescription>Church-related details and spiritual information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Spiritual Info Section -->
            <SpiritualInfoSection
              :form-data="formData"
              :errors="errors"
              @update:formData="updateFormData"
            />

            <Separator />

            <!-- Groups Section -->
            <GroupsSection
              :form-data="formData"
              :errors="errors"
              @update:formData="updateFormData"
            />

            <Separator />

            <!-- Privacy Settings Section -->
            <PrivacySettingsSection
              :form-data="formData"
              :errors="errors"
              :can-manage-status="true"
              @update:formData="updateFormData"
            />
          </CardContent>
        </Card>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="flex items-center gap-2">
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
            {{ isEditMode ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>
            {{ isEditMode ? 'Update Member' : 'Create Member' }}
          </span>
        </Button>
      </div>
    </form>
  </div>
</template>
