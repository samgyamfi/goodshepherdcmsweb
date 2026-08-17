<script setup>
import { ref, watch } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupAdministrationService } from '../services/groupAdministrationService'
import { showToast } from '@/utils/toast'

defineProps({
  districts: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
})

const districtId = ref('')
const userId = ref('')
const role = ref('district_group_coordinator')
const officers = ref([])

async function load() {
  if (!districtId.value) {
    officers.value = []
    return
  }
  const response = await groupAdministrationService.officers(Number(districtId.value))
  officers.value = response.data.data.assignments ?? []
}

async function assign() {
  await groupAdministrationService.assignOfficer({
    district_id: Number(districtId.value),
    user_id: Number(userId.value),
    role: role.value,
  })
  showToast.success('District officer assigned.')
  userId.value = ''
  load()
}

async function remove(officer) {
  await groupAdministrationService.removeOfficer(officer.uuid)
  showToast.success('District officer assignment removed.')
  load()
}

watch(districtId, load)
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold">District officers</h2>
      <p class="text-sm text-muted-foreground">
        Assign district-scoped template and coordination responsibilities.
      </p>
    </div>

    <div class="grid gap-4 rounded-md border p-4 md:grid-cols-[1fr_1fr_220px_auto] md:items-end">
      <div class="space-y-2">
        <Label>District</Label>
        <Select v-model="districtId">
          <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="district in districts" :key="district.id" :value="String(district.id)">
              {{ district.name }} · {{ district.region }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-2">
        <Label>User</Label>
        <Select v-model="userId" :disabled="!districtId">
          <SelectTrigger><SelectValue placeholder="Select church user" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="user in users" :key="user.id" :value="String(user.id)">
              {{ user.name }}{{ user.email ? ` · ${user.email}` : '' }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-2">
        <Label>Officer role</Label>
        <Select v-model="role">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="district_admin">District administrator</SelectItem>
            <SelectItem value="district_group_coordinator">Group coordinator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button :disabled="!districtId || !userId" @click="assign">
        <Plus class="mr-2 h-4 w-4" /> Assign
      </Button>
    </div>

    <div class="divide-y border-y">
      <article v-for="officer in officers" :key="officer.uuid" class="flex items-center justify-between gap-4 py-4">
        <div>
          <p class="font-medium">{{ officer.user?.name }}</p>
          <p class="text-sm text-muted-foreground">{{ officer.role.replaceAll('_', ' ') }}</p>
        </div>
        <Button size="icon" variant="ghost" title="Remove assignment" @click="remove(officer)">
          <Trash2 class="h-4 w-4" />
        </Button>
      </article>
      <p v-if="districtId && !officers.length" class="py-10 text-center text-sm text-muted-foreground">
        No officers are assigned to this district.
      </p>
    </div>
  </section>
</template>
