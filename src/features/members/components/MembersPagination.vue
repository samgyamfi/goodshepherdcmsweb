<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * MembersPagination Component
 * Displays pagination controls for members list
 * 
 * @props {Number} currentPage - Current page number
 * @props {Number} totalPages - Total number of pages
 * @props {Number} rowsPerPage - Number of rows per page
 * @props {Number} totalItems - Total number of items
 * @emits {Event} page-change - Emitted when page changes
 * @emits {Event} rows-per-page-change - Emitted when rows per page changes
 */

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change', 'rows-per-page-change'])

/**
 * Calculate start item number
 * @returns {Number} Start item number
 */
const startItem = computed(() => {
  return (props.currentPage - 1) * props.rowsPerPage + 1
})

/**
 * Calculate end item number
 * @returns {Number} End item number
 */
const endItem = computed(() => {
  return Math.min(props.currentPage * props.rowsPerPage, props.totalItems)
})

/**
 * Go to first page
 */
function goToFirstPage() {
  emit('page-change', 1)
}

/**
 * Go to previous page
 */
function goToPrevPage() {
  emit('page-change', props.currentPage - 1)
}

/**
 * Go to next page
 */
function goToNextPage() {
  emit('page-change', props.currentPage + 1)
}

/**
 * Go to last page
 */
function goToLastPage() {
  emit('page-change', props.totalPages)
}

// Rows per page options
const rowsPerPageOptions = [10, 25, 50, 100]
</script>

<template>
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Items Display Info -->
    <div class="flex items-center gap-4">
      <div class="text-sm text-muted-foreground">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} members
      </div>
      
      <!-- Rows Per Page Selector -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Rows per page:</span>
        <Select
          :model-value="rowsPerPage.toString()"
          @update:model-value="(value) => emit('rows-per-page-change', parseInt(value))"
        >
          <SelectTrigger class="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in rowsPerPageOptions"
              :key="option"
              :value="option.toString()"
            >
              {{ option }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <div class="flex items-center gap-1">
        <!-- First Page -->
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === 1"
          @click="goToFirstPage"
        >
          <span class="sr-only">First page</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </Button>
        
        <!-- Previous Page -->
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === 1"
          @click="goToPrevPage"
        >
          <span class="sr-only">Previous page</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        
        <!-- Next Page -->
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === totalPages"
          @click="goToNextPage"
        >
          <span class="sr-only">Next page</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
        
        <!-- Last Page -->
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === totalPages"
          @click="goToLastPage"
        >
          <span class="sr-only">Last page</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>
