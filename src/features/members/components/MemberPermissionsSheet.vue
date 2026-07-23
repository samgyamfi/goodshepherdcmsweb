<script setup>
import { computed, ref, watch } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, Lock, Search, X } from 'lucide-vue-next'
import { membersService } from '@/services/members/members'
import { showToast } from '@/utils/toast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  member: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'updated', 'update:isOpen'])

const loading = ref(false)
const saving = ref(false)
const search = ref('')
const payload = ref(null)
const selectedDirectIds = ref(new Set())

const memberUuid = computed(() => props.member?.uuid)
const directCount = computed(() => selectedDirectIds.value.size)
const assignedGroups = computed(() => filterGroups(payload.value?.assigned_groups ?? []))
const availableGroups = computed(() => filterGroups(payload.value?.available_groups ?? []))

watch(
  () => [props.isOpen, memberUuid.value],
  ([isOpen]) => {
    if (isOpen && memberUuid.value) {
      loadPermissions()
    }
  },
)

function handleOpenChange(value) {
  emit('update:isOpen', value)

  if (!value) {
    emit('close')
    resetState()
  }
}

function closeSheet() {
  handleOpenChange(false)
}

function resetState() {
  payload.value = null
  selectedDirectIds.value = new Set()
  search.value = ''
}

async function loadPermissions() {
  loading.value = true

  try {
    const response = await membersService.getMemberPermissions(memberUuid.value)

    if (!response.status) {
      showToast.error(response.message || 'Could not load member permissions')
      return
    }

    payload.value = response.data
    selectedDirectIds.value = new Set(response.data.direct_permission_ids ?? [])
  } catch (error) {
    console.error('Load member permissions error:', error)
    showToast.error(error.response?.data?.message || 'Could not load member permissions')
  } finally {
    loading.value = false
  }
}

async function savePermissions() {
  if (!memberUuid.value) return

  saving.value = true

  try {
    const response = await membersService.updateMemberPermissions(
      memberUuid.value,
      Array.from(selectedDirectIds.value),
    )

    if (!response.status) {
      showToast.error(response.message || 'Could not save member permissions')
      return
    }

    payload.value = response.data
    selectedDirectIds.value = new Set(response.data.direct_permission_ids ?? [])
    showToast.success('Member permissions updated')
    emit('updated', response.data)
  } catch (error) {
    console.error('Save member permissions error:', error)
    showToast.error(error.response?.data?.message || 'Could not save member permissions')
  } finally {
    saving.value = false
  }
}

function filterGroups(groups) {
  const term = search.value.trim().toLowerCase()
  if (!term) return groups

  return groups
    .map((group) => ({
      ...group,
      permissions: (group.permissions ?? []).filter((permission) =>
        permission.name.toLowerCase().includes(term),
      ),
    }))
    .filter((group) => group.permissions.length > 0)
}

function isChecked(permission) {
  return permission.is_inherited || selectedDirectIds.value.has(permission.id)
}

function togglePermission(permission, checked) {
  if (permission.locked) return

  const next = new Set(selectedDirectIds.value)

  if (checked === true) {
    next.add(permission.id)
  } else {
    next.delete(permission.id)
  }

  selectedDirectIds.value = next
}

function sourceLabel(permission) {
  if (permission.is_direct && permission.is_inherited) return 'Role + Direct'
  if (permission.is_inherited) return 'Role'
  if (permission.is_direct) return 'Direct'
  return 'Available'
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent
      side="right"
      class="w-[96vw] sm:w-[88vw] md:w-[760px] lg:w-[900px] p-0 flex flex-col"
    >
      <SheetHeader class="px-6 py-5 border-b">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <SheetTitle class="flex items-center gap-2 text-lg">
              <ShieldCheck class="h-5 w-5" />
              Member Permissions
            </SheetTitle>
            <SheetDescription class="mt-1">
              {{ member?.full_name || `${member?.first_name ?? ''} ${member?.last_name ?? ''}` }}
            </SheetDescription>
          </div>
          <SheetClose as-child>
            <Button variant="ghost" size="icon" @click="closeSheet">
              <X class="h-4 w-4" />
              <span class="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <div class="px-6 py-4 border-b space-y-3">
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-md border p-3">
            <p class="text-xs text-muted-foreground">Direct</p>
            <p class="text-xl font-semibold">{{ directCount }}</p>
          </div>
          <div class="rounded-md border p-3">
            <p class="text-xs text-muted-foreground">Assigned Groups</p>
            <p class="text-xl font-semibold">{{ payload?.assigned_groups?.length ?? 0 }}</p>
          </div>
          <div class="rounded-md border p-3">
            <p class="text-xs text-muted-foreground">Available Groups</p>
            <p class="text-xl font-semibold">{{ payload?.available_groups?.length ?? 0 }}</p>
          </div>
        </div>

        <div class="relative">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="search"
            class="pl-9"
            placeholder="Search permissions"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="space-y-3">
            <Skeleton class="h-5 w-48" />
            <Skeleton class="h-20 w-full" />
          </div>
        </template>

        <template v-else>
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold">Assigned Permissions</h3>
              <p class="text-sm text-muted-foreground">
                Role-derived permissions are locked. Direct permissions can be removed.
              </p>
            </div>

            <div v-if="assignedGroups.length" class="space-y-3">
              <div
                v-for="group in assignedGroups"
                :key="group.group"
                class="rounded-md border"
              >
                <div class="flex items-center justify-between border-b px-4 py-3">
                  <h4 class="text-sm font-medium">{{ group.group_name }}</h4>
                  <Badge variant="secondary">{{ group.permissions.length }}</Badge>
                </div>
                <div class="grid gap-2 p-3 sm:grid-cols-2">
                  <label
                    v-for="permission in group.permissions"
                    :key="permission.id"
                    class="flex min-h-12 items-center gap-3 rounded-md border px-3 py-2 text-sm"
                    :class="permission.locked ? 'bg-muted/40 text-muted-foreground' : 'hover:bg-muted/40'"
                  >
                    <Checkbox
                      :model-value="isChecked(permission)"
                      :disabled="permission.locked"
                      @update:model-value="togglePermission(permission, $event)"
                    />
                    <span class="min-w-0 flex-1 truncate">{{ permission.name }}</span>
                    <Badge variant="outline" class="shrink-0">{{ sourceLabel(permission) }}</Badge>
                    <Lock v-if="permission.locked" class="h-3.5 w-3.5 shrink-0" />
                  </label>
                </div>
              </div>
            </div>
            <div v-else class="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
              No assigned permissions match this view.
            </div>
          </section>

          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold">Available Permissions</h3>
              <p class="text-sm text-muted-foreground">
                Add direct permissions for this member in the current church.
              </p>
            </div>

            <div v-if="availableGroups.length" class="space-y-3">
              <div
                v-for="group in availableGroups"
                :key="group.group"
                class="rounded-md border"
              >
                <div class="flex items-center justify-between border-b px-4 py-3">
                  <h4 class="text-sm font-medium">{{ group.group_name }}</h4>
                  <Badge variant="secondary">{{ group.permissions.length }}</Badge>
                </div>
                <div class="grid gap-2 p-3 sm:grid-cols-2">
                  <label
                    v-for="permission in group.permissions"
                    :key="permission.id"
                    class="flex min-h-12 items-center gap-3 rounded-md border px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    <Checkbox
                      :model-value="isChecked(permission)"
                      @update:model-value="togglePermission(permission, $event)"
                    />
                    <span class="min-w-0 flex-1 truncate">{{ permission.name }}</span>
                    <Badge variant="outline" class="shrink-0">{{ sourceLabel(permission) }}</Badge>
                  </label>
                </div>
              </div>
            </div>
            <div v-else class="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
              No available permissions match this view.
            </div>
          </section>
        </template>
      </div>

      <SheetFooter class="px-6 py-4 border-t bg-background">
        <div class="flex w-full items-center justify-between gap-3">
          <p class="text-sm text-muted-foreground">
            Changes apply only to this church context.
          </p>
          <div class="flex gap-2">
            <Button variant="outline" @click="closeSheet">Cancel</Button>
            <Button :disabled="loading || saving" @click="savePermissions">
              {{ saving ? 'Saving...' : 'Save Permissions' }}
            </Button>
          </div>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
