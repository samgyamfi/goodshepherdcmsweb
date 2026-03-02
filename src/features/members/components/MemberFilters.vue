<script setup>
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: '',
  },
  membershipStatusFilter: {
    type: String,
    default: '',
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'status-change', 'membership-status-change', 'rows-per-page-change', 'clear-filters'])

// Status options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'inactive', label: 'Inactive' },
]

// Membership status options
const membershipStatusOptions = [
  { value: '', label: 'All Membership Statuses' },
  { value: 'active', label: 'Active Member' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'transferred', label: 'Transferred' },
]

// Rows per page options
const rowsPerPageOptions = [5, 10, 20, 50, 100]

// Handle search input
function handleSearchInput(event) {
  emit('search', event.target.value)
}

// Handle status change
function handleStatusChange(value) {
  emit('status-change', value)
}

// Handle membership status change
function handleMembershipStatusChange(value) {
  emit('membership-status-change', value)
}

// Handle rows per page change
function handleRowsPerPageChange(value) {
  emit('rows-per-page-change', Number(value))
}

// Check if any filters are active
const hasActiveFilters = props.searchQuery || props.statusFilter || props.membershipStatusFilter
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <!-- Search -->
    <div class="relative flex-1 max-w-sm">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        :value="searchQuery"
        @input="handleSearchInput"
        placeholder="Search members by name, phone, or email..."
        class="pl-10"
      />
      <button
        v-if="searchQuery"
        @click="emit('search', '')"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Status Filter -->
      <Select :value="statusFilter" @update:model-value="handleStatusChange">
        <SelectTrigger class="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
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

      <!-- Membership Status Filter -->
      <Select :value="membershipStatusFilter" @update:model-value="handleMembershipStatusChange">
        <SelectTrigger class="w-[160px]">
          <SelectValue placeholder="Membership" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Membership Status</SelectLabel>
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

      <!-- Rows Per Page -->
      <Select :value="String(rowsPerPage)" @update:model-value="handleRowsPerPageChange">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rows per page</SelectLabel>
            <SelectItem
              v-for="option in rowsPerPageOptions"
              :key="option"
              :value="String(option)"
            >
              {{ option }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <!-- Clear Filters -->
      <Button
        v-if="hasActiveFilters"
        variant="outline"
        size="icon"
        @click="emit('clear-filters')"
        title="Clear all filters"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
