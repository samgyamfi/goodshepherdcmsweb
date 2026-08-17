<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { TimePicker } from '@/components/ui/time-picker'
import EventAttachmentUploader from './EventAttachmentUploader.vue'
import LocationFields from '@/components/location/LocationFields.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  event: { type: Object, default: null },
  service: { type: Object, required: true },
})

const emit = defineEmits(['update:open', 'saved'])
const saving = ref(false)
const categories = ref([])
const statuses = ref([])
const form = reactive(defaults())
const title = computed(() => props.event ? 'Edit event' : 'Create event')

function defaults() {
  return {
    name: '', description: '', category_id: '', status: 'scheduled',
    event_date: '', event_time: '', end_date: '', end_time: '', location: '',
    digital_address: '', speaker: '', capacity: '', expected_attendance: '',
    is_recurring: false, recurrence_rule: '', requires_rsvp: false, is_active: true,
    images: [], documents: [], remove_file_uuids: [],
  }
}

function hydrate(event) {
  Object.keys(form).forEach((key) => delete form[key])
  Object.assign(form, defaults(), event || {})
  form.category_id = event?.category?.id || event?.category_id || ''
  form.event_time = normalizeTime(event?.event_time)
  form.end_date = event?.end_datetime?.slice(0, 10) || ''
  form.end_time = normalizeTime(event?.end_datetime?.slice(11, 16))
}

async function loadOptions() {
  const response = await props.service.formOptions()
  categories.value = response.data.data.categories || []
  statuses.value = response.data.data.statuses || []
}

function payload() {
  const data = { ...form }
  data.event_time = normalizeTime(form.event_time)
  data.end_datetime = form.end_date
    ? `${form.end_date} ${normalizeTime(form.end_time) || '23:59'}`
    : ''
  delete data.end_date
  delete data.end_time
  return data
}

function normalizeTime(value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})/)
  if (!match) return ''

  return `${match[1].padStart(2, '0')}:${match[2]}`
}

async function submit() {
  saving.value = true
  try {
    const response = props.event
      ? await props.service.update(props.event.uuid, payload())
      : await props.service.create(payload())
    emit('saved', response.data.data.event, response.data.data.conflicts || [])
    emit('update:open', false)
  } finally {
    saving.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    hydrate(props.event)
    if (!categories.value.length) loadOptions()
  },
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent side="right" class="flex w-[98vw] max-w-none flex-col p-0 sm:w-[96vw] lg:w-[92vw] xl:w-[1500px] 2xl:w-[1700px]">
      <SheetHeader class="border-b px-5 py-4 sm:px-8">
        <SheetTitle>{{ title }}</SheetTitle>
      </SheetHeader>
      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="submit">
        <div class="grid gap-8 px-5 py-6 sm:px-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div class="space-y-6">
            <div class="space-y-2"><Label>Event name <span class="text-destructive">*</span></Label><Input v-model="form.name" required /></div>
            <div class="space-y-2"><Label>Description <span class="text-muted-foreground">(optional)</span></Label><RichTextEditor v-model="form.description" /></div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Category <span class="text-muted-foreground">(optional)</span></Label>
                <Select v-model="form.category_id"><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem v-for="category in categories" :key="category.uuid" :value="category.id">{{ category.name }}</SelectItem></SelectContent></Select>
              </div>
              <div class="space-y-2">
                <Label>Status <span class="text-muted-foreground">(optional)</span></Label>
                <Select v-model="form.status"><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem v-for="status in statuses" :key="status.value" :value="status.value">{{ status.name }}</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div class="space-y-2"><Label>Speaker or facilitator <span class="text-muted-foreground">(optional)</span></Label><Input v-model="form.speaker" /></div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2"><Label>Start date <span class="text-destructive">*</span></Label><DatePicker v-model="form.event_date" /></div>
              <div class="space-y-2"><Label>Start time <span class="text-muted-foreground">(optional)</span></Label><TimePicker id="event-start-time" v-model="form.event_time" /></div>
              <div class="space-y-2"><Label>End date <span class="text-muted-foreground">(optional)</span></Label><DatePicker v-model="form.end_date" /></div>
              <div class="space-y-2"><Label>End time <span class="text-muted-foreground">(optional)</span></Label><TimePicker id="event-end-time" v-model="form.end_time" /></div>
            </div>
            <LocationFields
              v-model:location="form.location"
              v-model:digital-address="form.digital_address"
            />
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2"><Label>Capacity <span class="text-muted-foreground">(optional)</span></Label><Input v-model="form.capacity" type="number" min="1" /></div>
              <div class="space-y-2"><Label>Expected attendance <span class="text-muted-foreground">(optional)</span></Label><Input v-model="form.expected_attendance" type="number" min="0" /></div>
            </div>
          </div>

          <div class="space-y-6 border-t pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
            <EventAttachmentUploader
              v-model:images="form.images"
              v-model:documents="form.documents"
              v-model:removed-uuids="form.remove_file_uuids"
              :existing-images="event?.media?.images || event?.images || []"
              :existing-documents="event?.media?.documents || []"
            />
            <div class="space-y-2"><Label>Recurrence details <span class="text-muted-foreground">(optional)</span></Label><Input v-model="form.recurrence_rule" :disabled="!form.is_recurring" placeholder="Describe the recurrence" /></div>
            <div class="divide-y rounded-md border px-4">
              <label class="flex items-center justify-between gap-4 py-4"><span><b class="block text-sm">Recurring event</b><small class="text-muted-foreground">This event repeats on a schedule.</small></span><Switch v-model="form.is_recurring" /></label>
              <label class="flex items-center justify-between gap-4 py-4"><span><b class="block text-sm">Require RSVP</b><small class="text-muted-foreground">Attendees must confirm participation.</small></span><Switch v-model="form.requires_rsvp" /></label>
              <label class="flex items-center justify-between gap-4 py-4"><span><b class="block text-sm">Active</b><small class="text-muted-foreground">Show this event in active listings.</small></span><Switch v-model="form.is_active" /></label>
            </div>
          </div>
        </div>
        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-8">
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit" :disabled="saving || !form.name || !form.event_date">
            <LoaderCircle v-if="saving" class="mr-2 h-4 w-4 animate-spin" /> Save event
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
