<script setup>
import { reactive, watch } from 'vue'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import TimePicker from '@/components/ui/time-picker/TimePicker.vue'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import GroupLocationFields from '@/components/location/LocationFields.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  type: { type: String, required: true },
  item: { type: Object, default: null },
  members: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:open', 'save'])
const form = reactive({})

const labels = {
  announcements: 'announcement',
  schedules: 'meeting schedule',
  minutes: 'meeting minutes',
  notices: 'direct notice',
}

function defaults() {
  return {
    title: '',
    name: '',
    subject: '',
    body: '',
    visibility: 'members',
    is_pinned: false,
    recurrence_type: 'weekly',
    day_of_week: 0,
    starts_on: '',
    ends_on: '',
    starts_at: '',
    ends_at: '',
    timezone: 'Africa/Accra',
    location: '',
    digital_address: '',
    is_active: true,
    meeting_date: '',
    recipient_membership_uuid: '',
    priority: 'normal',
    expires_at: '',
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) Object.assign(form, defaults(), props.item || {})
  },
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="flex w-[96vw] max-w-none flex-col p-0 sm:w-[92vw] lg:w-[72vw] xl:w-[980px]"
    >
      <SheetHeader class="border-b px-5 py-4 sm:px-7">
        <SheetTitle>
          {{ item ? 'Edit' : 'Create' }} {{ labels[type] }}
        </SheetTitle>
      </SheetHeader>
      <form
        class="min-h-0 flex-1 overflow-y-auto"
        @submit.prevent="emit('save', { ...form })"
      >
        <div class="grid gap-5 px-5 py-6 sm:px-7">
          <template v-if="type === 'announcements'">
            <div class="space-y-2"><Label>Title</Label><Input v-model="form.title" required /></div>
            <div class="space-y-2">
              <Label>Announcement</Label><RichTextEditor v-model="form.body" />
            </div>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.is_pinned" type="checkbox" /> Pin this announcement
            </label>
          </template>

          <template v-else-if="type === 'schedules'">
            <div class="space-y-2"><Label>Name</Label><Input v-model="form.name" required /></div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Recurrence</Label>
                <select v-model="form.recurrence_type" class="field-select">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every two weeks</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div class="space-y-2">
                <Label>Day of week</Label>
                <select v-model="form.day_of_week" class="field-select">
                  <option v-for="(day, index) in ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']" :key="day" :value="index">
                    {{ day }}
                  </option>
                </select>
              </div>
              <div class="space-y-2"><Label>Starts on</Label><DatePicker v-model="form.starts_on" /></div>
              <div class="space-y-2"><Label>Ends on</Label><DatePicker v-model="form.ends_on" /></div>
              <div class="space-y-2"><Label>Start time</Label><TimePicker v-model="form.starts_at" /></div>
              <div class="space-y-2"><Label>End time</Label><TimePicker v-model="form.ends_at" /></div>
            </div>
            <GroupLocationFields
              v-model:location="form.location"
              v-model:digital-address="form.digital_address"
            />
          </template>

          <template v-else-if="type === 'minutes'">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2"><Label>Title</Label><Input v-model="form.title" required /></div>
              <div class="space-y-2"><Label>Meeting date</Label><DatePicker v-model="form.meeting_date" /></div>
            </div>
            <div class="space-y-2"><Label>Minutes</Label><RichTextEditor v-model="form.body" /></div>
          </template>

          <template v-else>
            <div class="space-y-2">
              <Label>Recipient</Label>
              <select v-model="form.recipient_membership_uuid" class="field-select" required>
                <option value="">Select group member</option>
                <option v-for="member in members" :key="member.uuid" :value="member.uuid">
                  {{ member.profile?.user?.first_name }} {{ member.profile?.user?.last_name }}
                </option>
              </select>
            </div>
            <div class="space-y-2"><Label>Subject</Label><Input v-model="form.subject" required /></div>
            <div class="space-y-2"><Label>Notice</Label><RichTextEditor v-model="form.body" /></div>
          </template>
        </div>

        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-7">
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit">Save</Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
.field-select {
  @apply h-10 w-full rounded-md border border-input bg-background px-3 text-sm;
}
</style>
