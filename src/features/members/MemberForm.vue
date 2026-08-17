<script setup>
import { computed, ref, watch } from 'vue'
import { useMemberForm } from './composables/useMemberForm.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { X } from 'lucide-vue-next'
import { membersService } from '@/services/members/members'
import { showToast } from '@/utils/toast'

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
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel', 'update:isOpen'])

const { formData, errors, isSubmitting, submitForm, hydrate } = useMemberForm(
  props.member,
  props.isEditMode,
)
const formOptions = ref({
  countries: [],
  groups: [],
})
const optionsLoaded = ref(false)
const optionsLoading = ref(false)

const groups = computed(() => formOptions.value.groups ?? [])

watch(
  () => [props.isOpen, props.member?.uuid, props.isEditMode],
  ([isOpen]) => {
    if (!isOpen) return

    hydrate(props.member, props.isEditMode)
    loadFormOptions()
  },
  { immediate: true },
)

async function loadFormOptions() {
  if (optionsLoaded.value || optionsLoading.value) return

  optionsLoading.value = true

  try {
    const response = await membersService.getFormOptions()

    if (response.status) {
      formOptions.value = response.data
      optionsLoaded.value = true
      return
    }

    showToast.error(response.message || 'Could not load member form options')
  } catch (error) {
    console.error('Member form options error:', error)
    showToast.error(error.response?.data?.message || 'Could not load member form options')
  } finally {
    optionsLoading.value = false
  }
}

// Handle form submission
async function handleSubmit() {
  const success = await submitForm()
  if (success) {
    emit('submit', formData)
    emit('update:isOpen', false)
  }
}

// Handle cancel/close
function handleCancel() {
  hydrate(null, false)
  emit('cancel')
  emit('update:isOpen', false)
}

// Update form data from section components
function updateFormData(updates) {
  Object.keys(updates).forEach((key) => {
    formData[key] = updates[key]
  })
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="(value) => emit('update:isOpen', value)">
    <SheetContent
      side="right"
      class="flex w-[98vw] max-w-none flex-col p-0 sm:w-[96vw] lg:w-[92vw] xl:w-400 2xl:w-450"
    >
      <!-- Header -->
      <SheetHeader class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <SheetTitle>
            {{ isEditMode ? 'Edit Member' : 'Create New Member' }}
          </SheetTitle>
          <SheetClose as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="handleCancel">
              <X class="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
        <p class="text-sm text-muted-foreground">
          {{ isEditMode ? 'Update member information' : 'Add a new member to the church' }}
        </p>
      </SheetHeader>

      <!-- Form Content - Scrollable -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto px-6 py-4">
        <div class="space-y-6">
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
                  @update:form-data="updateFormData"
                />

                <Separator />

                <!-- Demographics Section -->
                <DemographicsSection
                  :form-data="formData"
                  :errors="errors"
                  @update:form-data="updateFormData"
                />

                <Separator />

                <!-- Location Info Section -->
                <LocationInfoSection
                  :form-data="formData"
                  :errors="errors"
                  @update:form-data="updateFormData"
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
                  @update:form-data="updateFormData"
                />

                <Separator />

                <!-- Groups Section -->
                <GroupsSection
                  :form-data="formData"
                  :errors="errors"
                  :groups="groups"
                  @update:form-data="updateFormData"
                />

                <Separator />

                <!-- Privacy Settings Section -->
                <PrivacySettingsSection
                  :form-data="formData"
                  :errors="errors"
                  :can-manage-status="true"
                  @update:form-data="updateFormData"
                />
              </CardContent>
            </Card>
          </div>

          <!-- Form Actions -->
          <div
            class="flex items-center justify-end gap-3 sticky bottom-0 bg-background pt-4 border-t"
          >
            <Button type="button" variant="outline" @click="handleCancel"> Cancel </Button>
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
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
