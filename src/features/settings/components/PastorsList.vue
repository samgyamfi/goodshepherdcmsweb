<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Pencil, Trash2, User, Search, ChevronUp, ChevronDown } from 'lucide-vue-next'
import TablePagination from '@/components/ui/table/TablePagination.vue'

const props = defineProps({
  pastors:     { type: Array,   required: true },
  loading:     { type: Boolean, default: false },
  pagination:  { type: Object,  required: true },
  searchQuery: { type: String,  default: '' },
})

const emit = defineEmits(['edit', 'delete', 'reorder', 'page-change', 'per-page-change', 'search'])

// Sorted by display_order so up/down index math is correct
const sortedPastors = computed(() =>
  [...props.pastors].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
)

function getStatusVariant(isActive) {
  return isActive ? 'default' : 'secondary'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Swap display_order between two adjacent pastors and emit the full
 * reordered list so the parent / store can persist it.
 */
function swapOrder(indexA, indexB) {
  const list    = [...sortedPastors.value]
  const orderA  = list[indexA].display_order ?? indexA + 1
  const orderB  = list[indexB].display_order ?? indexB + 1

  emit('reorder', [
    { id: list[indexA].id, display_order: orderB },
    { id: list[indexB].id, display_order: orderA },
  ])
}

function moveUp(index)   { if (index > 0)                       swapOrder(index, index - 1) }
function moveDown(index) { if (index < sortedPastors.value.length - 1) swapOrder(index, index + 1) }
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex items-center gap-2">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          placeholder="Search pastors…"
          class="pl-10"
          @update:model-value="(v) => emit('search', v)"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[72px] text-center">Order</TableHead>
            <TableHead>Pastor</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ordained</TableHead>
            <TableHead class="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          <!-- Loading skeletons -->
          <template v-if="loading">
            <TableRow v-for="i in 3" :key="i">
              <TableCell><Skeleton class="h-4 w-8 mx-auto" /></TableCell>
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell><Skeleton class="h-4 w-24" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-4 w-20" /></TableCell>
              <TableCell><Skeleton class="h-6 w-16" /></TableCell>
              <TableCell><Skeleton class="h-4 w-24" /></TableCell>
              <TableCell><Skeleton class="h-8 w-20" /></TableCell>
            </TableRow>
          </template>

          <!-- Empty state -->
          <template v-else-if="sortedPastors.length === 0">
            <TableRow>
              <TableCell :colspan="8" class="text-center py-8">
                <div class="flex flex-col items-center gap-2 text-muted-foreground">
                  <User class="h-12 w-12 opacity-20" />
                  <p>No pastors found</p>
                  <p class="text-sm">Add your first pastor to get started</p>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Data rows -->
          <template v-else>
            <TableRow v-for="(pastor, index) in sortedPastors" :key="pastor.id">

              <!-- Order cell: position badge + up/down controls -->
              <TableCell class="text-center">
                <div class="flex flex-col items-center gap-0.5">
                  <button
                    class="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    :disabled="index === 0"
                    title="Move up"
                    @click="moveUp(index)"
                  >
                    <ChevronUp class="h-3.5 w-3.5 mx-auto" />
                  </button>

                  <span class="text-xs font-mono font-medium tabular-nums w-6 text-center leading-none py-0.5 rounded bg-muted text-muted-foreground">
                    {{ pastor.display_order ?? index + 1 }}
                  </span>

                  <button
                    class="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    :disabled="index === sortedPastors.length - 1"
                    title="Move down"
                    @click="moveDown(index)"
                  >
                    <ChevronDown class="h-3.5 w-3.5 mx-auto" />
                  </button>
                </div>
              </TableCell>

              <TableCell>
                <div class="flex items-center gap-2">
                  <div v-if="pastor.photo_url" class="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img :src="pastor.photo_url" :alt="pastor.full_name" class="h-full w-full object-cover" />
                  </div>
                  <div v-else class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium">{{ pastor.full_name }}</div>
                    <div class="text-xs text-muted-foreground">{{ pastor.email }}</div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="outline">{{ pastor.title }}</Badge>
              </TableCell>

              <TableCell>
                <div class="text-sm">
                  <div>{{ pastor.phone || 'N/A' }}</div>
                  <div class="text-xs text-muted-foreground">{{ pastor.email }}</div>
                </div>
              </TableCell>

              <TableCell>{{ pastor.specialty || 'N/A' }}</TableCell>

              <TableCell>
                <Badge :variant="getStatusVariant(pastor.is_active)">
                  {{ pastor.is_active ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>

              <TableCell>{{ formatDate(pastor.ordained_date) }}</TableCell>

              <TableCell>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon" title="Edit pastor" @click="emit('edit', pastor)">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    class="text-destructive hover:text-destructive"
                    title="Delete pastor"
                    @click="emit('delete', pastor)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>

        </TableBody>
      </Table>
    </div>

    <TablePagination
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :per-page="pagination.perPage"
      :total="pagination.total"
      :from="pagination.from"
      :to="pagination.to"
      @page-change="(page) => emit('page-change', page)"
      @per-page-change="(perPage) => emit('per-page-change', perPage)"
    />
  </div>
</template>
