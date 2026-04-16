<script setup>
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { FileUpload } from '@/components/ui/file-upload'
import { UserRound } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pastor: {
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
  title: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  bio: '',
  specialty: '',
  ordained_date: '',
  is_active: true,
})

// Photo file
const photoFile = ref(null)

// Watch for pastor changes (edit mode)
watch(() => props.pastor, (newPastor) => {
  if (newPastor) {
    formData.value = {
      title: newPastor.title || '',
      first_name: newPastor.first_name || '',
      last_name: newPastor.last_name || '',
      phone: newPastor.phone || '',
      email: newPastor.email || '',
      bio: newPastor.bio || '',
      specialty: newPastor.specialty || '',
      ordained_date: newPastor.ordained_date || '',
      is_active: newPastor.is_active ?? true,
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Pastor title options
const titleOptions = [
  { value: 'Pastor', label: 'Pastor' },
  { value: 'Senior Pastor', label: 'Senior Pastor' },
  { value: 'Associate Pastor', label: 'Associate Pastor' },
  { value: 'Assistant Pastor', label: 'Assistant Pastor' },
  { value: 'Youth Pastor', label: 'Youth Pastor' },
  { value: 'Worship Pastor', label: 'Worship Pastor' },
  { value: 'Children\'s Pastor', label: 'Children\'s Pastor' },
  { value: 'Reverend', label: 'Reverend' },
  { value: 'Bishop', label: 'Bishop' },
  { value: 'Elder', label: 'Elder' },
  { value: 'Deacon', label: 'Deacon' },
  { value: 'Minister', label: 'Minister' },
]

/**
 * Reset form to default values
 */
function resetForm() {
  formData.value = {
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    bio: '',
    specialty: '',
    ordained_date: '',
    is_active: true,
  }
  photoFile.value = null
}

/**
 * Handle photo file selection
 */
function handlePhotoSelect(file) {
  photoFile.value = file
}

/**
 * Handle form submission
 */
function handleSubmit() {
  emit('save', {
    ...formData.value,
    photoFile: photoFile.value,
  })
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
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <UserRound class="h-5 w-5" />
          {{ pastor ? 'Edit Pastor' : 'Add New Pastor' }}
        </DialogTitle>
        <DialogDescription>
          {{ pastor ? 'Update pastor information' : 'Add a new pastor to your church' }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Photo Upload -->
        <div class="space-y-2">
          <Label>Pastor Photo</Label>
          <FileUpload
            :model-value="photoFile"
            label="Upload Photo"
            description="Drag and drop or click to browse"
            accept="image/*"
            :max-size="2"
            @change="handlePhotoSelect"
          />
          <p class="text-xs text-muted-foreground">
            Recommended size: 400x400px. Max size: 2MB
          </p>
        </div>

        <!-- Title & Name -->
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="space-y-2">
            <Label for="title">Title *</Label>
            <Select v-model="formData.title">
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pastoral Titles</SelectLabel>
                  <SelectItem
                    v-for="option in titleOptions"
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
            <Label for="first_name">First Name *</Label>
            <Input
              id="first_name"
              v-model="formData.first_name"
              placeholder="John"
            />
          </div>

          <div class="space-y-2">
            <Label for="last_name">Last Name *</Label>
            <Input
              id="last_name"
              v-model="formData.last_name"
              placeholder="Doe"
            />
          </div>
        </div>

        <!-- Contact Info -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="pastor@example.com"
            />
          </div>
        </div>

        <!-- Specialty & Ordained Date -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="specialty">Specialty/Ministry</Label>
            <Input
              id="specialty"
              v-model="formData.specialty"
              placeholder="e.g., Youth Ministry, Worship"
            />
          </div>

          <div class="space-y-2">
            <Label for="ordained_date">Ordained Date</Label>
            <Input
              id="ordained_date"
              v-model="formData.ordained_date"
              type="date"
            />
          </div>
        </div>

        <!-- Bio -->
        <div class="space-y-2">
          <Label for="bio">Bio/Description</Label>
          <Textarea
            id="bio"
            v-model="formData.bio"
            placeholder="Brief biography or description"
            rows="4"
            class="resize-none"
          />
        </div>

        <!-- Active Status -->
        <div class="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div class="space-y-0.5">
            <Label for="is_active">Active Status</Label>
            <p class="text-xs text-muted-foreground">
              {{ formData.is_active ? 'Currently serving' : 'Not currently serving' }}
            </p>
          </div>
          <Switch
            id="is_active"
            v-model="formData.is_active"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button
          type="button"
          :disabled="isSaving || !formData.title || !formData.first_name || !formData.last_name"
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
            {{ pastor ? 'Update' : 'Create' }} Pastor
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
