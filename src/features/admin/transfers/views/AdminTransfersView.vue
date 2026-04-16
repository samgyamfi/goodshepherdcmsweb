<script setup>
import { ref, onMounted } from 'vue'
import { useAdminTransfers } from '../composables/useAdminTransfers'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import TransferStats from '../components/TransferStats.vue'
import TransfersList from '../components/TransfersList.vue'
import TransferDetailSheet from '../components/TransferDetailSheet.vue'
import { ArrowLeftRight } from 'lucide-vue-next'

const { confirm } = useConfirm()

const {
  requests,
  loading,
  stats,
  searchQuery,
  statusFilter,
  dateRange,
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  loadTransfers,
  approveRequest,
  rejectRequest,
} = useAdminTransfers()

// Local state
const isSheetOpen = ref(false)
const selectedRequest = ref(null)
const isSaving = ref(false)

/**
 * Handle search
 */
function handleSearch(value) {
  searchQuery.value = value
  loadTransfers()
}

/**
 * Handle status filter change
 */
function handleStatusChange(value) {
  statusFilter.value = value
  loadTransfers()
}

/**
 * Handle date range change
 */
function handleDateRangeChange(value) {
  dateRange.value = value
  loadTransfers()
}

/**
 * Handle page change
 */
function handlePageChange(page) {
  currentPage.value = page
  loadTransfers()
}

/**
 * Handle per page change
 */
function handlePerPageChange(newPerPage) {
  perPage.value = newPerPage
  currentPage.value = 1
  loadTransfers()
}

/**
 * Handle request click to show details
 */
function handleRequestClick(request) {
  selectedRequest.value = request
  isSheetOpen.value = true
}

/**
 * Handle approve request
 */
async function handleApprove(request) {
  const ok = await confirm({
    title: `Approve transfer for ${request.user?.full_name}?`,
    description: `This will move ${request.user?.full_name} from ${request.from_church?.name} to ${request.to_church?.name}.`,
    confirmLabel: 'Approve',
    cancelLabel: 'Cancel',
    variant: 'default',
  })
  if (!ok) return

  isSaving.value = true
  try {
    await approveRequest(request.uuid)
    showToast.success('Transfer request approved.')
    isSheetOpen.value = false
  } catch {
    showToast.error('Failed to approve request.')
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle reject request
 */
async function handleReject(request, reason) {
  const ok = await confirm({
    title: `Reject transfer for ${request.user?.full_name}?`,
    description: reason ? `Reason: ${reason}` : 'The request will be marked as rejected.',
    confirmLabel: 'Reject',
    cancelLabel: 'Cancel',
    variant: 'destructive',
  })
  if (!ok) return

  isSaving.value = true
  try {
    await rejectRequest(request.uuid, reason)
    showToast.success('Transfer request rejected.')
    isSheetOpen.value = false
  } catch {
    showToast.error('Failed to reject request.')
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle sheet close
 */
function handleClose() {
  isSheetOpen.value = false
  selectedRequest.value = null
}

// Lifecycle
onMounted(() => {
  loadTransfers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
        <ArrowLeftRight class="h-5 w-5 text-orange-500" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground">Transfer Requests</h1>
        <p class="text-sm text-muted-foreground">Church membership transfer requests across the platform</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <TransferStats :stats="stats" />

    <!-- Transfers List with Filters -->
    <TransfersList
      :requests="requests"
      :loading="loading"
      :pagination="{ currentPage, lastPage, perPage, total, from, to }"
      :search-query="searchQuery"
      :status-filter="statusFilter"
      :date-range="dateRange"
      @search="handleSearch"
      @status-change="handleStatusChange"
      @date-range-change="handleDateRangeChange"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
      @edit="handleRequestClick"
      @approve="handleApprove"
      @reject="handleReject"
    />

    <!-- Transfer Detail Sheet -->
    <TransferDetailSheet
      :is-open="isSheetOpen"
      :request="selectedRequest"
      :is-saving="isSaving"
      @close="handleClose"
      @approve="handleApprove"
      @reject="handleReject"
    />
  </div>
</template>
