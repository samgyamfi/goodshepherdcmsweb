<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FileDown, Calendar as CalendarIcon, X } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'export'])

/**
 * Export format
 */
const format = ref('excel')

/**
 * Export filters
 */
const filters = ref({
  status: '',
  membershipStatus: '',
  search: '',
  dateFrom: null,
  dateTo: null,
})

/**
 * Loading state
 */
const isExporting = ref(false)

/**
 * Format options
 */
const formatOptions = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
]

/**
 * Status options
 */
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'inactive', label: 'Inactive' },
]

/**
 * Membership status options
 */
const membershipStatusOptions = [
  { value: '', label: 'All Membership Statuses' },
  { value: 'active', label: 'Active Member' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'transferred', label: 'Transferred' },
]

/**
 * Clear filters
 */
function clearFilters() {
  filters.value = {
    status: '',
    membershipStatus: '',
    search: '',
    dateFrom: null,
    dateTo: null,
  }
}

/**
 * Handle export
 */
async function handleExport() {
  isExporting.value = true

  try {
    const exportData = {
      filters: {
        status: filters.value.status || undefined,
        membership_status: filters.value.membershipStatus || undefined,
        search: filters.value.search || undefined,
        date_from: filters.value.dateFrom
          ? new Date(filters.value.dateFrom).toISOString().split('T')[0]
          : undefined,
        date_to: filters.value.dateTo
          ? new Date(filters.value.dateTo).toISOString().split('T')[0]
          : undefined,
      },
      format: format.value,
    }

    emit('export', exportData)
  } catch (error) {
    console.error('Export error:', error)
  } finally {
    isExporting.value = false
  }
}

/**
 * Handle close
 */
function handleClose() {
  emit('close')
  clearFilters()
  format.value = 'excel'
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <FileDown class="h-5 w-5" />
          Export Members
        </DialogTitle>
        <DialogDescription>
          Download members data in your preferred format. Apply filters to export specific members.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Format Selection -->
        <div class="space-y-2">
          <Label for="format">Export Format</Label>
          <Select v-model="format">
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="option in formatOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Search Filter -->
        <div class="space-y-2">
          <Label for="search">Search</Label>
          <Input
            id="search"
            v-model="filters.search"
            placeholder="Search by name, phone, or email"
          />
        </div>

        <!-- Status Filters -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="status">User Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="membershipStatus">Membership Status</Label>
            <Select v-model="filters.membershipStatus">
              <SelectTrigger>
                <SelectValue placeholder="Select membership status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="option in membershipStatusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="space-y-2">
          <Label>Date Range</Label>
          <div class="grid gap-2 sm:grid-cols-2">
            <!-- From Date -->
            <div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full justify-start text-left font-normal"
                    :class="!filters.dateFrom && 'text-muted-foreground'"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ filters.dateFrom ? new Date(filters.dateFrom).toLocaleDateString() : 'From' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    v-model="filters.dateFrom"
                    :default-value="new Date()"
                    initial-focus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <!-- To Date -->
            <div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full justify-start text-left font-normal"
                    :class="!filters.dateTo && 'text-muted-foreground'"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ filters.dateTo ? new Date(filters.dateTo).toLocaleDateString() : 'To' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    v-model="filters.dateTo"
                    :default-value="new Date()"
                    initial-focus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="clearFilters"
          >
            <X class="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button type="button" :disabled="isExporting" @click="handleExport">
          <span v-if="isExporting" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
          <span v-else class="flex items-center gap-2">
            <FileDown class="h-4 w-4" />
            Export
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
