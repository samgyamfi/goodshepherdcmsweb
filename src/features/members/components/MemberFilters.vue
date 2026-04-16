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
import { UserStatus, MembershipStatus } from '@/enums'

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
  perPage: {
    type: Number,
    default: 15,
  },
  perPageOptions: {
    type: Array,
    required: true,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'search',
  'status-change',
  'membership-status-change',
  'per-page-change',
  'clear-filters',
])

// Status options — sourced from UserStatus enum
const statusOptions = UserStatus.asOptions(true)

// Membership status options — sourced from MembershipStatus enum
const membershipStatusOptions = MembershipStatus.asOptions(true)

// Handle search input with v-model
function handleSearchInput(event) {
  emit('search', event.target.value?.trim() || '')
}

// Handle status change
function handleStatusChange(value) {
  emit('status-change', value === null ? '' : value)
}

// Handle membership status change
function handleMembershipStatusChange(value) {
  emit('membership-status-change', value === null ? '' : value)
}

// Handle rows per page change
function handleRowsPerPageChange(value) {
  emit('per-page-change', Number(value))
}

// Check if any filters are active
function hasActiveFilters() {
  return props.searchQuery || props.statusFilter || props.membershipStatusFilter
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <!-- Search -->
    <div class="relative flex-1 max-w-sm">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        :model-value="searchQuery"
        @keydown.enter="handleSearchInput"
        placeholder="Search members by name, phone, or email..."
        class="pl-10"
      />
      <button
        v-if="searchQuery"
        @click="emit('search', '')"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        type="button"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Status Filter -->
      <Select :model-value="statusFilter || null" @update:model-value="handleStatusChange">
        <SelectTrigger class="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <!-- Membership Status Filter -->
      <Select
        :model-value="membershipStatusFilter || null"
        @update:model-value="handleMembershipStatusChange"
      >
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
      <Select :model-value="String(perPage)" @update:model-value="handleRowsPerPageChange">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rows per page</SelectLabel>
            <SelectItem v-for="option in perPageOptions" :key="option" :value="String(option)">
              {{ option }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <!-- Clear Filters -->
      <Button
        v-if="hasActiveFilters()"
        variant="outline"
        size="icon"
        @click="emit('clear-filters')"
        title="Clear all filters"
        type="button"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
