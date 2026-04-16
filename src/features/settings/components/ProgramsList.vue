<script setup>
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
import { Pencil, Trash2, Calendar, Search } from 'lucide-vue-next'
import TablePagination from '@/components/ui/table/TablePagination.vue'

defineProps({
  programs: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    required: true,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['edit', 'delete', 'page-change', 'per-page-change', 'search'])

/**
 * Get status badge variant
 */
function getStatusVariant(isActive) {
  return isActive ? 'default' : 'secondary'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex items-center gap-2">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          @update:model-value="handleSearch"
          placeholder="Search programs..."
          class="pl-10"
          @input="emit('search', $event.target.value)"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Leader</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow v-for="i in 3" :key="i">
              <TableCell>
                <Skeleton class="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton class="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton class="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton class="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton class="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton class="h-8 w-16" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="programs.length === 0">
            <TableRow>
              <TableCell :colspan="6" class="text-center py-8">
                <div class="flex flex-col items-center gap-2 text-muted-foreground">
                  <Calendar class="h-12 w-12 opacity-20" />
                  <p>No programs found</p>
                  <p class="text-sm">Add your first program to get started</p>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow v-for="program in programs" :key="program.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ program.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ program.description }}</div>
                </div>
              </TableCell>
              <TableCell>
                <div class="text-sm">
                  <div v-if="program.day_of_week">{{ program.day_of_week }}</div>
                  <div v-if="program.time" class="text-xs text-muted-foreground">
                    {{ program.time }}
                  </div>
                </div>
              </TableCell>
              <TableCell>{{ program.location || 'N/A' }}</TableCell>
              <TableCell>{{ program.leader || 'N/A' }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(program.is_active)">
                  {{ program.is_active ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="emit('edit', program)"
                    title="Edit program"
                  >
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-destructive hover:text-destructive"
                    @click="emit('delete', program)"
                    title="Delete program"
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

    <!-- Pagination -->
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
