<script setup>
import { ref } from 'vue'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { Search, Calendar as CalendarIcon, CheckCircle, XCircle, Filter } from 'lucide-vue-next'
import { TransferRequestStatus } from '@/enums'
import { formatDateRange } from '@/utils/dateHelpers'

const props = defineProps({
  requests: {
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
  statusFilter: {
    type: String,
    default: '',
  },
  dateRange: {
    type: Object,
    default: () => ({ start: null, end: null }),
  },
})

const emit = defineEmits([
  'edit',
  'approve',
  'reject',
  'page-change',
  'per-page-change',
  'search',
  'status-change',
  'date-range-change',
])

const localDateRange = ref({
  start: props.dateRange?.start || null,
  end: props.dateRange?.end || null,
})

const statusOptions = TransferRequestStatus.asOptions(true)

/**
 * Handle date range selection
 */
function handleDateRangeChange() {
  emit('date-range-change', localDateRange.value)
}

/**
 * Handle status filter change
 */
function handleStatusChange(value) {
  emit('status-change', value)
}

/**
 * Handle search
 */
function handleSearch(value) {
  emit('search', value)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          :model-value="searchQuery"
          @update:model-value="handleSearch"
          placeholder="Search by member, email, church..."
          class="pl-10"
        />
      </div>

      <!-- Status Filter -->
      <Select :model-value="statusFilter" @update:model-value="handleStatusChange">
        <SelectTrigger class="w-[180px]">
          <Filter class="mr-2 h-4 w-4" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- Date Range Picker -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" class="w-[280px] justify-start text-left font-normal">
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ localDateRange.start ? formatDateRange(localDateRange) : 'Pick a date range' }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            v-model="localDateRange"
            mode="range"
            @update:model-value="handleDateRangeChange"
          />
        </PopoverContent>
      </Popover>
    </div>

    <!-- Table -->
    <div class="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>From Church</TableHead>
            <TableHead>To Church</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead class="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Loading State -->
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell><Skeleton class="h-4 w-32" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-4 w-28" /></TableCell>
              <TableCell><Skeleton class="h-5 w-20" /></TableCell>
              <TableCell><Skeleton class="h-4 w-24" /></TableCell>
              <TableCell><Skeleton class="h-8 w-20 mx-auto" /></TableCell>
            </TableRow>
          </template>

          <!-- Empty State -->
          <template v-else-if="requests.length === 0">
            <TableRow>
              <TableCell :colspan="6" class="py-12 text-center">
                <div class="flex flex-col items-center gap-2 text-muted-foreground">
                  <CalendarIcon class="h-10 w-10 opacity-20" />
                  <p class="text-sm">No transfer requests found</p>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <TableRow v-for="req in requests" :key="req.uuid">
              <TableCell>
                <div class="font-medium text-sm">{{ req.user?.full_name }}</div>
                <div class="text-xs text-muted-foreground">{{ req.user?.email }}</div>
              </TableCell>
              <TableCell class="text-sm">{{ req.from_church?.name ?? '—' }}</TableCell>
              <TableCell class="text-sm">{{ req.to_church?.name ?? '—' }}</TableCell>
              <TableCell>
                <Badge :variant="TransferRequestStatus.badgeVariant(req.status)" class="capitalize">
                  {{ TransferRequestStatus.label(req.status) }}
                </Badge>
              </TableCell>
              <TableCell class="text-sm text-muted-foreground whitespace-nowrap">
                {{ req.created_at ? new Date(req.created_at).toLocaleDateString() : '—' }}
              </TableCell>
              <TableCell>
                <div
                  v-if="TransferRequestStatus.isPending(req.status)"
                  class="flex items-center justify-center gap-2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Approve"
                    @click="emit('approve', req)"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Reject"
                    @click="emit('reject', req)"
                  >
                    <XCircle class="h-4 w-4" />
                  </Button>
                </div>
                <span v-else class="block text-center text-xs text-muted-foreground capitalize">
                  {{ TransferRequestStatus.label(req.status) }}
                </span>
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
