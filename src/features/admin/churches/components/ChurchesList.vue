<script setup>
import { ref, computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Building2,
  MoreHorizontal,
  ExternalLink,
  Settings,
  ToggleLeft,
  ToggleRight,
  Trash2,
  RotateCcw,
  ShieldAlert,
} from 'lucide-vue-next'
import helpers from '@/utils/generalHelpers'

const props = defineProps({
  /** 'active' shows the normal list; 'deleted' shows trashed records */
  mode:        { type: String,  default: 'active' },
  churches:    { type: Array,   required: true },
  loading:     { type: Boolean, default: false },
  pagination:  { type: Object,  required: true },
  searchQuery: { type: String,  default: '' },
})

const emit = defineEmits([
  'page-change',
  'per-page-change',
  'search',
  'view-landing',
  'access-settings',
  'toggle-status',
  'delete',
  'restore',
  'force-delete',
  'bulk-delete',
  'bulk-restore',
  'bulk-force-delete',
])

// ── Bulk selection (keyed by UUID, never numeric id) ──────────────────────────
const selectedUuids = ref([])

const allSelected = computed(() =>
  props.churches.length > 0 && props.churches.every((c) => selectedUuids.value.includes(c.uuid)),
)

const someSelected = computed(() =>
  selectedUuids.value.length > 0 && !allSelected.value,
)

/**
 * The value bound to the header checkbox's :model-value.
 * Reka-UI CheckboxRoot accepts true | false | 'indeterminate'.
 */
const headerCheckboxValue = computed(() => {
  if (allSelected.value) return true
  if (someSelected.value) return 'indeterminate'
  return false
})

/**
 * Toggle a single row — uses helpers.selectAnItem.
 * @param {string} uuid
 * @param {boolean} checked — new state emitted by the checkbox
 */
function toggleRow(uuid, checked) {
  selectedUuids.value = helpers.selectAnItem([...selectedUuids.value], { uuid }, 'uuid', checked)
}

/**
 * Select / deselect all visible rows — uses helpers.pushAllItemsIntoArray.
 * @param {boolean} checked
 */
function toggleAll(checked) {
  selectedUuids.value = helpers.pushAllItemsIntoArray([], props.churches, 'uuid', checked)
}

function clearSelection() {
  selectedUuids.value = []
}

function emitBulk(action) {
  emit(`bulk-${action}`, [...selectedUuids.value])
  clearSelection()
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function statusVariant(isActive) {
  return isActive ? 'default' : 'secondary'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search toolbar -->
    <div class="flex items-center gap-2">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          :placeholder="mode === 'deleted' ? 'Search deleted churches…' : 'Search by name, city or email…'"
          class="pl-10"
          @update:model-value="emit('search', $event)"
        />
      </div>
    </div>

    <!-- Bulk actions toolbar (appears when rows are selected) -->
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
        <span class="text-sm font-medium">
          {{ selectedUuids.length }} selected
        </span>

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

          <Button size="sm" variant="ghost" @click="clearSelection">
            Cancel
          </Button>
        </div>
      </div>
    </transition>

    <!-- Table -->
    <div class="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <!-- Select-all checkbox: modelValue drives checked / indeterminate visual -->
            <TableHead class="w-10">
              <Checkbox
                :model-value="headerCheckboxValue"
                @update:model-value="toggleAll"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Church</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead class="text-center">Members</TableHead>
            <TableHead v-if="mode === 'active'">Status</TableHead>
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
              <TableCell><Skeleton class="h-4 w-24" /></TableCell>
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
              <TableCell><Skeleton class="h-5 w-16" /></TableCell>
              <TableCell><Skeleton class="h-8 w-8 mx-auto" /></TableCell>
            </TableRow>
          </template>

          <!-- Empty state -->
          <template v-else-if="churches.length === 0">
            <TableRow>
              <TableCell :colspan="7" class="py-12 text-center">
                <div class="flex flex-col items-center gap-2 text-muted-foreground">
                  <Building2 class="h-10 w-10 opacity-20" />
                  <p class="text-sm">
                    {{ mode === 'deleted' ? 'No deleted churches' : 'No churches found' }}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Data rows -->
          <template v-else>
            <TableRow
              v-for="church in churches"
              :key="church.uuid"
              :class="selectedUuids.includes(church.uuid) ? 'bg-muted/40' : ''"
            >
              <!-- Row checkbox — arrow fn passes uuid + new checked state -->
              <TableCell>
                <Checkbox
                  :model-value="selectedUuids.includes(church.uuid)"
                  @update:model-value="(checked) => toggleRow(church.uuid, checked)"
                  :aria-label="`Select ${church.name}`"
                />
              </TableCell>

              <!-- Church name + logo -->
              <TableCell>
                <div class="flex items-center gap-3">
                  <div
                    v-if="church.logo"
                    class="h-9 w-9 rounded-full overflow-hidden shrink-0 border"
                  >
                    <img :src="church.logo" :alt="church.name" class="h-full w-full object-cover" />
                  </div>
                  <div
                    v-else
                    class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary"
                  >
                    {{ church.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-sm truncate">{{ church.name }}</div>
                    <div class="text-xs text-muted-foreground font-mono">{{ church.uuid }}</div>
                  </div>
                </div>
              </TableCell>

              <!-- Location -->
              <TableCell class="text-sm text-muted-foreground">
                {{ church.city || '—' }}
              </TableCell>

              <!-- Contact -->
              <TableCell>
                <div class="text-sm space-y-0.5">
                  <div v-if="church.email" class="truncate max-w-[160px]">{{ church.email }}</div>
                  <div v-if="church.phone" class="text-xs text-muted-foreground">{{ church.phone }}</div>
                  <span v-if="!church.email && !church.phone" class="text-muted-foreground">—</span>
                </div>
              </TableCell>

              <!-- Members -->
              <TableCell class="text-center">
                <Badge variant="outline" class="tabular-nums">
                  {{ (church.members_count ?? 0).toLocaleString() }}
                </Badge>
              </TableCell>

              <!-- Status (active) or deleted_at (deleted) -->
              <TableCell>
                <template v-if="mode === 'active'">
                  <Badge :variant="statusVariant(church.is_active)">
                    {{ church.is_active ? 'Active' : 'Inactive' }}
                  </Badge>
                </template>
                <template v-else>
                  <span class="text-xs text-muted-foreground">
                    {{ church.deleted_at ? new Date(church.deleted_at).toLocaleDateString() : '—' }}
                  </span>
                </template>
              </TableCell>

              <!-- Actions dropdown -->
              <TableCell class="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Open actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-52">

                    <!-- Active mode actions -->
                    <template v-if="mode === 'active'">
                      <DropdownMenuItem class="gap-2" @click="$emit('view-landing', church)">
                        <ExternalLink class="h-4 w-4 text-muted-foreground" />
                        View Landing Page
                      </DropdownMenuItem>

                      <DropdownMenuItem class="gap-2" @click="$emit('access-settings', church)">
                        <Settings class="h-4 w-4 text-muted-foreground" />
                        Access Church Settings
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem class="gap-2" @click="$emit('toggle-status', church)">
                        <component
                          :is="church.is_active ? ToggleLeft : ToggleRight"
                          class="h-4 w-4 text-muted-foreground"
                        />
                        {{ church.is_active ? 'Deactivate' : 'Activate' }}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        class="gap-2 text-destructive focus:text-destructive"
                        @click="$emit('delete', church)"
                      >
                        <Trash2 class="h-4 w-4" />
                        Move to Trash
                      </DropdownMenuItem>
                    </template>

                    <!-- Deleted mode actions -->
                    <template v-else>
                      <DropdownMenuItem class="gap-2" @click="$emit('restore', church)">
                        <RotateCcw class="h-4 w-4 text-muted-foreground" />
                        Restore Church
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        class="gap-2 text-destructive focus:text-destructive"
                        @click="$emit('force-delete', church)"
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
