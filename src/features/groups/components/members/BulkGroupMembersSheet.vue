<script setup>
import { ref, watch } from 'vue'
import { Plus, Trash2, UsersRound } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupsService } from '../../services/groupsService'
import { showToast } from '@/utils/toast'

const props = defineProps({
  open: { type: Boolean, default: false },
  groupUuid: { type: String, required: true },
})

const emit = defineEmits(['update:open', 'saved'])
const options = ref({ profiles: [], member_roles: [], member_statuses: [] })
const rows = ref([])
const loading = ref(false)

function newRow() {
  return {
    key: crypto.randomUUID(),
    profile_uuid: '',
    member_role: 'member',
    title: '',
    status: 'active',
  }
}

function addRow() {
  rows.value.push(newRow())
}

function removeRow(index) {
  rows.value.splice(index, 1)
  if (!rows.value.length) addRow()
}

async function loadOptions() {
  const response = await groupsService.formOptions()
  options.value = response.data.data
}

async function submit() {
  loading.value = true
  try {
    await groupsService.addMembers(
      props.groupUuid,
      rows.value.map((row) => ({
        profile_uuid: row.profile_uuid,
        member_role: row.member_role,
        title: row.title,
        status: row.status,
      })),
    )
    showToast.success('Group memberships updated.')
    emit('saved')
    emit('update:open', false)
  } catch (error) {
    showToast.error(error.response?.data?.message || 'Members could not be added.')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    rows.value = [newRow()]
    loadOptions()
  },
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="flex w-[98vw] max-w-none flex-col p-0 sm:w-[96vw] lg:w-[92vw] xl:w-[1500px] 2xl:w-[1700px]"
    >
      <SheetHeader class="border-b px-5 py-4 sm:px-7">
        <SheetTitle class="flex items-center gap-2">
          <UsersRound class="h-5 w-5" /> Add group members
        </SheetTitle>
      </SheetHeader>

      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="submit">
        <div class="space-y-4 px-5 py-6 sm:px-7">
          <div
            v-for="(row, index) in rows"
            :key="row.key"
            class="grid gap-4 rounded-md border p-4 lg:grid-cols-2 2xl:grid-cols-[minmax(280px,1.4fr)_220px_minmax(220px,1fr)_180px_40px] 2xl:items-end"
          >
            <div class="space-y-2">
              <Label>Church member</Label>
              <Select v-model="row.profile_uuid" required>
                <SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="profile in options.profiles"
                    :key="profile.uuid"
                    :value="profile.uuid"
                  >
                    {{ profile.name }}{{ profile.phone ? ` · ${profile.phone}` : '' }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Group role</Label>
              <Select v-model="row.member_role">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="role in options.member_roles"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Display title</Label>
              <Input v-model="row.title" placeholder="Optional title" />
            </div>
            <div class="space-y-2">
              <Label>Status</Label>
              <Select v-model="row.status">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="status in options.member_statuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              title="Remove row"
              @click="removeRow(index)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>

          <Button type="button" variant="outline" @click="addRow">
            <Plus class="mr-2 h-4 w-4" /> Add row
          </Button>
        </div>

        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-7">
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : `Add ${rows.length} member(s)` }}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
