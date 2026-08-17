<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { groupsService } from '../services/groupsService'
import { showToast } from '@/utils/toast'

const props = defineProps({ group: { type: Object, required: true } })
const name = ref(props.group.name)
const description = ref(props.group.description || '')
const isActive = ref(props.group.is_active)
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await groupsService.update(props.group.uuid, {
      name: name.value,
      description: description.value,
      is_active: isActive.value,
    })
    showToast.success('Group settings updated.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="max-w-3xl space-y-6" @submit.prevent="save">
    <div>
      <h2 class="text-lg font-semibold">Group settings</h2>
      <p class="text-sm text-muted-foreground">Core identity and publishing status.</p>
    </div>
    <div class="space-y-2"><Label>Name</Label><Input v-model="name" required /></div>
    <div class="space-y-2">
      <Label>Description</Label><Textarea v-model="description" rows="5" />
    </div>
    <label class="flex items-center justify-between rounded-md border p-4">
      <span>
        <span class="block text-sm font-medium">Active group</span>
        <span class="text-xs text-muted-foreground">Show this group in active listings.</span>
      </span>
      <input v-model="isActive" type="checkbox" class="h-4 w-4" />
    </label>
    <Button :disabled="saving || group.is_archived">
      {{ saving ? 'Saving...' : 'Save settings' }}
    </Button>
  </form>
</template>
