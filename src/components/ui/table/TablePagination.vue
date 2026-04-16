<script setup>
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  lastPage: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 15,
  },
  total: {
    type: Number,
    default: 0,
  },
  from: {
    type: Number,
    default: 0,
  },
  to: {
    type: Number,
    default: 0,
  },
  perPageOptions: {
    type: Array,
    default: () => [10, 15, 20, 50, 100],
  },
  showFirstLast: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'page-change',
  'per-page-change',
])

// Computed
const hasPages = () => props.lastPage > 1
const hasPrevPage = () => props.currentPage > 1
const hasNextPage = () => props.currentPage < props.lastPage

// Handlers
function onPageChange(page) {
  if (page >= 1 && page <= props.lastPage) {
    emit('page-change', page)
  }
}

function onPerPageChange(value) {
  emit('per-page-change', Number(value))
}

function goToFirstPage() {
  onPageChange(1)
}

function goToPrevPage() {
  onPageChange(props.currentPage - 1)
}

function goToNextPage() {
  onPageChange(props.currentPage + 1)
}

function goToLastPage() {
  onPageChange(props.lastPage)
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
    <!-- Left side - Per page & info -->
    <div class="flex flex-wrap gap-2 items-center space-x-2 lg:space-x-4">
      <!-- Per page selector -->
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select
          :model-value="String(perPage)"
          @update:model-value="onPerPageChange"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="String(perPage)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="option in perPageOptions"
              :key="option"
              :value="String(option)"
            >
              {{ option }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Page info -->
      <div
        v-if="total > 0"
        class="flex items-center justify-center text-sm font-medium whitespace-nowrap"
      >
        {{ from }}-{{ to }} of {{ total }}
      </div>
      <div
        v-else
        class="flex items-center justify-center text-sm font-medium whitespace-nowrap text-muted-foreground"
      >
        No items
      </div>
    </div>

    <!-- Right side - Pagination buttons -->
    <div class="flex items-center space-x-2">
      <!-- First page (hidden on mobile) -->
      <Button
        v-if="showFirstLast"
        variant="outline"
        class="hidden h-8 w-8 p-0 lg:flex"
        :disabled="!hasPrevPage"
        @click="goToFirstPage"
        title="Go to first page"
      >
        <ChevronsLeft class="h-4 w-4" />
      </Button>

      <!-- Previous page -->
      <Button
        variant="outline"
        class="h-8 w-8 p-0"
        :disabled="!hasPrevPage"
        @click="goToPrevPage"
        title="Go to previous page"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <!-- Page indicator -->
      <div
        v-if="hasPages"
        class="flex items-center justify-center text-sm font-medium min-w-[80px]"
      >
        Page {{ currentPage }} of {{ lastPage }}
      </div>

      <!-- Next page -->
      <Button
        variant="outline"
        class="h-8 w-8 p-0"
        :disabled="!hasNextPage"
        @click="goToNextPage"
        title="Go to next page"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>

      <!-- Last page (hidden on mobile) -->
      <Button
        v-if="showFirstLast"
        variant="outline"
        class="hidden h-8 w-8 p-0 lg:flex"
        :disabled="!hasNextPage"
        @click="goToLastPage"
        title="Go to last page"
      >
        <ChevronsRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
