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
import { UserRound, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  pastor: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])

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
  display_order: null,
  photo: null,
})

const titleOptions = [
  { value: 'Pastor', label: 'Pastor' },
  { value: 'Senior Pastor', label: 'Senior Pastor' },
  { value: 'Associate Pastor', label: 'Associate Pastor' },
  { value: 'Assistant Pastor', label: 'Assistant Pastor' },
  { value: 'Youth Pastor', label: 'Youth Pastor' },
  { value: 'Worship Pastor', label: 'Worship Pastor' },
  { value: "Children's Pastor", label: "Children's Pastor" },
  { value: 'Reverend', label: 'Reverend' },
  { value: 'Bishop', label: 'Bishop' },
  { value: 'Elder', label: 'Elder' },
  { value: 'Deacon', label: 'Deacon' },
  { value: 'Minister', label: 'Minister' },
]

watch(
  () => props.pastor,
  (newPastor) => {
    if (newPastor) {
      formData.value = {
        title:         newPastor.title         || '',
        first_name:    newPastor.first_name    || '',
        last_name:     newPastor.last_name     || '',
        phone:         newPastor.phone         || '',
        email:         newPastor.email         || '',
        bio:           newPastor.bio           || '',
        specialty:     newPastor.specialty     || '',
        ordained_date: newPastor.ordained_date || '',
        is_active:     newPastor.is_active     ?? true,
        display_order: newPastor.display_order ?? null,
        photo:         null,
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function resetForm() {
  formData.value = {
    title:         '',
    first_name:    '',
    last_name:     '',
    phone:         '',
    email:         '',
    bio:           '',
    specialty:     '',
    ordained_date: '',
    is_active:     true,
    display_order: null,
    photo:         null,
  }
}

function handlePhotoSelect(file) {
  formData.value.photo = file
}

function handleSubmit() {
  emit('save', { ...formData.value })
}

function handleClose() {
  resetForm()
  emit('close')
}

const isFormValid = () =>
  formData.value.title && formData.value.first_name && formData.value.last_name
</script>

<template>
  <Sheet :open="isOpen" @update:open="handleClose">
    <SheetContent side="right" class="overflow-y-auto flex flex-col">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <UserRound class="h-5 w-5" />
          {{ pastor ? 'Edit Pastor' : 'Add New Pastor' }}
        </SheetTitle>
        <SheetDescription>
          {{ pastor ? 'Update pastor information and photo' : 'Add a new pastor to your church' }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 space-y-5 py-6">
        <!-- Photo Upload -->
        <div class="space-y-2">
          <Label>Pastor Photo</Label>
          <FileUpload
            :model-value="formData.photo"
            label="Upload Photo"
            description="Drag and drop or click to browse"
            accept="image/*"
            :max-size="2"
            @change="handlePhotoSelect"
          />
          <p class="text-xs text-muted-foreground">Recommended: 400×400px. Max 2MB.</p>
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
            <Input id="first_name" v-model="formData.first_name" placeholder="John" />
          </div>

          <div class="space-y-2">
            <Label for="last_name">Last Name *</Label>
            <Input id="last_name" v-model="formData.last_name" placeholder="Doe" />
          </div>
        </div>

        <!-- Contact -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input id="phone" v-model="formData.phone" type="tel" placeholder="+233 XX XXX XXXX" />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" type="email" placeholder="pastor@example.com" />
          </div>
        </div>

        <!-- Specialty & Ordained Date -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="specialty">Specialty / Ministry</Label>
            <Input id="specialty" v-model="formData.specialty" placeholder="e.g., Youth Ministry" />
          </div>
          <div class="space-y-2">
            <Label for="ordained_date">Ordained Date</Label>
            <Input id="ordained_date" v-model="formData.ordained_date" type="date" />
          </div>
        </div>

        <!-- Display Position -->
        <div class="space-y-2">
          <Label for="display_order">Display Position</Label>
          <Input
            id="display_order"
            v-model.number="formData.display_order"
            type="number"
            min="1"
            placeholder="Auto-assigned if left empty"
          />
          <p class="text-xs text-muted-foreground">
            Controls the order pastors appear on the public page. Lower numbers appear first.
            Leave blank to automatically place this pastor at the end of the list.
          </p>
        </div>

        <!-- Bio -->
        <div class="space-y-2">
          <Label for="bio">Bio / Description</Label>
          <Textarea
            id="bio"
            v-model="formData.bio"
            placeholder="Brief biography or description"
            rows="4"
            class="resize-none"
          />
        </div>

        <!-- Active Status -->
        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label for="is_active">Active Status</Label>
            <p class="text-xs text-muted-foreground mt-0.5">
              {{ formData.is_active ? 'Currently serving' : 'Not currently serving' }}
            </p>
          </div>
          <Switch id="is_active" v-model="formData.is_active" />
        </div>
      </div>

      <SheetFooter class="gap-2 pt-4 border-t">
        <Button variant="outline" type="button" @click="handleClose">Cancel</Button>
        <Button
          type="button"
          :disabled="isSaving || !isFormValid()"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSaving ? 'Saving...' : (pastor ? 'Update Pastor' : 'Create Pastor') }}
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
