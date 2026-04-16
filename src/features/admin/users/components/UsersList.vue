<script setup>
import { ref, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { Search, Users, MoreHorizontal, Trash2, RotateCcw, ShieldAlert, Eye } from 'lucide-vue-next'
import helpers from '@/utils/generalHelpers'
import { UserType } from '@/enums'

const props = defineProps({
  /** 'active' shows normal list; 'deleted' shows trashed records */
  mode:        { type: String,  default: 'active' },
  users:       { type: Array,   required: true },
  loading:     { type: Boolean, default: false },
  pagination:  { type: Object,  required: true },
  searchQuery: { type: String,  default: '' },
})

const emit = defineEmits([
  'page-change',
  'per-page-change',
  'search',
  'filter-type',
  'view-details',
  'delete',
  'restore',
  'force-delete',
  'bulk-delete',
  'bulk-restore',
  'bulk-force-delete',
])

// ── Bulk selection (keyed by UUID, never numeric id) ──────────────────────────
const selectedUuids = ref([])

const allSelected = computed(
  () => props.users.length > 0 && props.users.every((u) => selectedUuids.value.includes(u.uuid)),
)

const someSelected = computed(() => selectedUuids.value.length > 0 && !allSelected.value)

/**
 * The value passed to the header checkbox's :model-value.
 * Reka-UI CheckboxRoot accepts true | false | 'indeterminate'.
 */
const headerCheckboxValue = computed(() => {
  if (allSelected.value) return true
  if (someSelected.value) return 'indeterminate'
  return false
})

/**
 * Toggle a single row — uses helpers.selectAnItem so the logic is DRY.
 * @param {string} uuid
 * @param {boolean} checked — new desired state emitted by the checkbox
 */
function toggleRow(uuid, checked) {
  selectedUuids.value = helpers.selectAnItem([...selectedUuids.value], { uuid }, 'uuid', checked)
}

/**
 * Select / deselect all visible rows — uses helpers.pushAllItemsIntoArray.
 * @param {boolean} checked — emitted by the header checkbox (true = select all)
 */
function toggleAll(checked) {
  selectedUuids.value = helpers.pushAllItemsIntoArray([], props.users, 'uuid', checked)
}

function clearSelection() {
  selectedUuids.value = []
}

function emitBulk(action) {
  emit(`bulk-${action}`, [...selectedUuids.value])
  clearSelection()
}

// ── Constants — sourced entirely from the UserType enum ───────────────────────
const USER_TYPE_OPTIONS = [
  { value: null, label: 'All Types' },
  ...UserType.asOptions(),
]

function getUserTypeVariant(userType) {
  return UserType.badgeVariant(userType)
}

function getInitials(user) {
  const first = user.first_name?.[0] ?? ''
  const last  = user.last_name?.[0]  ?? ''
  return (first + last).toUpperCase() || 'U'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filters toolbar -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 max-w-sm min-w-[180px]">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          :placeholder="mode === 'deleted' ? 'Search deleted users…' : 'Search users…'"
          class="pl-10"
          @update:model-value="emit('search', $event)"
        />
      </div>

      <Select :default-value="''" @update:model-value="emit('filter-type', $event)">
        <SelectTrigger class="w-[160px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in USER_TYPE_OPTIONS" :key="String(opt.value)" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Bulk actions toolbar — visible only when rows are selected -->
    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="selectedUuids.length > 0"
        class="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-2.5"
      >
        <span class="text-sm font-medium">{{ selectedUuids.length }} selected</span>

        <div class="flex items-center gap-2 ml-auto">
          <template v-if="mode === 'active'">
            <Button
              size="sm"
              variant="outline"
              class="text-destructive border-destructive/30 hover:bg-destructive/5"
              @click="emitBulk('delete')"
            >
              <Trash2 class="h-3.5 w-3.5 mr-1.5" />
              Move to Trash
            </Button>
          </template>
          <template v-else>
            <Button size="sm" variant="outline" @click="emitBulk('restore')">
              <RotateCcw class="h-3.5 w-3.5 mr-1.5" />
              Restore
            </Button>
            <Button
              size="sm"
              variant="outline"
              class="text-destructive border-destructive/30 hover:bg-destructive/5"
              @click="emitBulk('force-delete')"
            >
              <ShieldAlert class="h-3.5 w-3.5 mr-1.5" />
              Delete Permanently
            </Button>
          </template>

          <Button size="sm" variant="ghost" @click="clearSelection">Cancel</Button>
        </div>
      </div>
    </transition>

    <!-- Table -->
    <div class="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <!-- Select-all checkbox: modelValue drives the checked/indeterminate visual -->
            <TableHead class="w-10">
              <Checkbox
                :model-value="headerCheckboxValue"
                @update:model-value="toggleAll"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Active Church</TableHead>
            <TableHead v-if="mode === 'active'">Joined</TableHead>
            <TableHead v-else>Deleted At</TableHead>
            <TableHead class="w-12 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Loading skeletons -->
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell><Skeleton class="h-4 w-4" /></TableCell>
              <TableCell><Skeleton class="h-4 w-40" /></TableCell>
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell><Skeleton class="h-5 w-20" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-4 w-20" /></TableCell>
              <TableCell><Skeleton class="h-8 w-8 mx-auto" /></TableCell>
            </TableRow>
          </template>

          <!-- Empty state -->
          <template v-else-if="users.length === 0">
            <TableRow>
              <TableCell :colspan="7" class="text-center py-10">
                <div class="flex flex-col items-center gap-2 text-muted-foreground">
                  <Users class="h-10 w-10 opacity-20" />
                  <p class="text-sm">
                    {{ mode === 'deleted' ? 'No deleted users' : 'No users found' }}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Data rows -->
          <template v-else>
            <TableRow
              v-for="user in users"
              :key="user.uuid"
              :class="selectedUuids.includes(user.uuid) ? 'bg-muted/40' : ''"
            >
              <!-- Row checkbox — arrow fn passes uuid + new checked state to toggleRow -->
              <TableCell>
                <Checkbox
                  :model-value="selectedUuids.includes(user.uuid)"
                  @update:model-value="(checked) => toggleRow(user.uuid, checked)"
                  :aria-label="`Select ${user.full_name}`"
                />
              </TableCell>

              <!-- Avatar + name -->
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8 shrink-0">
                    <AvatarImage :src="user.avatar" :alt="user.full_name" />
                    <AvatarFallback class="text-xs">{{ getInitials(user) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium text-sm">{{ user.full_name }}</div>
                    <div class="text-xs text-muted-foreground font-mono">{{ user.uuid }}</div>
                  </div>
                </div>
              </TableCell>

              <!-- Contact -->
              <TableCell>
                <div class="text-sm space-y-0.5">
                  <div v-if="user.email" class="text-foreground">{{ user.email }}</div>
                  <div v-if="user.phone" class="text-xs text-muted-foreground">{{ user.phone }}</div>
                </div>
              </TableCell>

              <!-- Type -->
              <TableCell>
                <Badge :variant="getUserTypeVariant(user.user_type)" class="capitalize text-xs">
                  {{ user.user_type_label ?? user.user_type }}
                </Badge>
              </TableCell>

              <!-- Active church -->
              <TableCell>
                <span v-if="user.active_church?.church_name" class="text-sm">
                  {{ user.active_church.church_name }}
                </span>
                <span v-else class="text-xs text-muted-foreground italic">No church</span>
              </TableCell>

              <!-- Joined / Deleted at -->
              <TableCell class="text-sm text-muted-foreground whitespace-nowrap">
                <template v-if="mode === 'active'">
                  {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}
                </template>
                <template v-else>
                  {{ user.deleted_at ? new Date(user.deleted_at).toLocaleDateString() : '—' }}
                </template>
              </TableCell>

              <!-- Actions -->
              <TableCell class="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Open actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-44">
                    <DropdownMenuItem class="gap-2" @click="$emit('view-details', user)">
                      <Eye class="h-4 w-4 text-muted-foreground" />
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <template v-if="mode === 'active'">
                      <DropdownMenuItem
                        class="gap-2 text-destructive focus:text-destructive"
                        @click="$emit('delete', user)"
                      >
                        <Trash2 class="h-4 w-4" />
                        Move to Trash
                      </DropdownMenuItem>
                    </template>

                    <template v-else>
                      <DropdownMenuItem class="gap-2" @click="$emit('restore', user)">
                        <RotateCcw class="h-4 w-4 text-muted-foreground" />
                        Restore User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        class="gap-2 text-destructive focus:text-destructive"
                        @click="$emit('force-delete', user)"
                      >
                        <ShieldAlert class="h-4 w-4" />
                        Delete Permanently
                      </DropdownMenuItem>
                    </template>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <TablePagination
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :per-page="pagination.perPage"
      :total="pagination.total"
      :from="pagination.from"
      :to="pagination.to"
      @page-change="emit('page-change', $event)"
      @per-page-change="emit('per-page-change', $event)"
    />
  </div>
</template>
