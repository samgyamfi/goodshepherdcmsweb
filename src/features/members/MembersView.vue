<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import { useMembers } from './composables/useMembers'
import { useMembersStore } from '@/stores/members/members'
import { showToast } from '@/utils/toast'
import { membersService } from '@/services/members/members'

// Component imports
import MemberTable from './components/MemberTable.vue'
import MemberFilters from './components/MemberFilters.vue'
import MembersPageHeader from './components/MembersPageHeader.vue'
import MembersPagination from './components/MembersPagination.vue'
import MemberActionDialogs from './components/MemberActionDialogs.vue'
import { ExportMembersDialog, ImportMembersDialog } from './components/import-export'

const membersStore = useMembersStore()

// Use members composable
const {
  searchQuery,
  currentPage,
  rowsPerPage,
  statusFilter,
  membershipStatusFilter,
  isSearching,
  members,
  loading,
  totalPages,
  totalItems,
  canManageMembers,
  canDeleteMembers,
  canImportMembers,
  canExportMembers,
  handleSearch,
  handlePageChange,
  handleRowsPerPageChange,
  handleStatusFilterChange,
  handleMembershipStatusFilterChange,
  clearFilters,
  refresh,
  initialize,
  dispose,
} = useMembers()

// Local state
const isFormOpen = ref(false)
const isDetailsOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isExportDialogOpen = ref(false)
const isImportDialogOpen = ref(false)
const selectedMember = ref(null)
const isEditMode = ref(false)

// Handle create new member
function handleCreateMember() {
  selectedMember.value = null
  isEditMode.value = false
  isFormOpen.value = true
}

// Handle view member
function handleViewMember(member) {
  selectedMember.value = member
  isDetailsOpen.value = true
}

// Handle edit member
function handleEditMember(member) {
  selectedMember.value = member
  isEditMode.value = true
  isFormOpen.value = true
  isDetailsOpen.value = false
}

// Handle approve member
async function handleApproveMember(member) {
  const success = await membersStore.approveMember(member.uuid || member.id)
  if (success) {
    refresh()
  }
}

// Handle suspend member
async function handleSuspendMember(member) {
  const success = await membersStore.suspendMember(member.uuid || member.id)
  if (success) {
    refresh()
  }
}

// Handle delete member (open dialog)
function handleDeleteMember(member) {
  selectedMember.value = member
  isDeleteDialogOpen.value = true
}

// Confirm delete
async function confirmDelete() {
  if (!selectedMember.value) return

  const success = await membersStore.deleteMember(selectedMember.value.uuid || selectedMember.value.id)
  if (success) {
    isDeleteDialogOpen.value = false
    selectedMember.value = null
    refresh()
  }
}

// Handle form submit
function handleFormSubmit() {
  isFormOpen.value = false
  selectedMember.value = null
  refresh()
}

// Handle form cancel
function handleFormCancel() {
  isFormOpen.value = false
  selectedMember.value = null
}

// Handle details close
function handleDetailsClose() {
  isDetailsOpen.value = false
  selectedMember.value = null
}

// Handle export
function handleExport() {
  isExportDialogOpen.value = true
}

// Handle export submit
async function handleExportSubmit(exportData) {
  try {
    const response = await membersService.exportMembers(exportData.filters, exportData.format)
    
    if (response.status) {
      showToast.success(
        `Export started! You will receive an email with the download link shortly.`
      )
      isExportDialogOpen.value = false
    } else {
      showToast.error(response.message || 'Export failed')
    }
  } catch (error) {
    console.error('Export error:', error)
    showToast.error(error.response?.data?.message || 'Export failed. Please try again.')
  }
}

// Handle import
function handleImport() {
  isImportDialogOpen.value = true
}

// Handle import submit
async function handleImportSubmit(formData) {
  try {
    const response = await membersService.importMembers(formData)
    
    if (response.status) {
      showToast.success(
        `Import started! You will receive an email with the results shortly.`
      )
      isImportDialogOpen.value = false
      // Refresh the members list after import completes
      setTimeout(() => {
        refresh()
      }, 5000)
    } else {
      showToast.error(response.message || 'Import failed')
    }
  } catch (error) {
    console.error('Import error:', error)
    showToast.error(error.response?.data?.message || 'Import failed. Please try again.')
  }
}

// Lifecycle
onMounted(() => {
  initialize()
})

onUnmounted(() => {
  dispose()
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <MembersPageHeader
        :can-create="canManageMembers"
        :can-import="canImportMembers"
        :can-export="canExportMembers"
        @create="handleCreateMember"
        @import="handleImport"
        @export="handleExport"
      />

      <!-- Filters -->
      <MemberFilters
        :search-query="searchQuery"
        :status-filter="statusFilter"
        :membership-status-filter="membershipStatusFilter"
        :rows-per-page="rowsPerPage"
        :is-searching="isSearching"
        @search="handleSearch"
        @status-change="handleStatusFilterChange"
        @membership-status-change="handleMembershipStatusFilterChange"
        @rows-per-page-change="handleRowsPerPageChange"
        @clear-filters="clearFilters"
      />

      <!-- Members Table -->
      <MemberTable
        :members="members"
        :loading="loading"
        :can-manage="canManageMembers"
        :can-delete="canDeleteMembers"
        @view="handleViewMember"
        @edit="handleEditMember"
        @approve="handleApproveMember"
        @suspend="handleSuspendMember"
        @delete="handleDeleteMember"
      />

      <!-- Pagination -->
      <MembersPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :rows-per-page="rowsPerPage"
        :total-items="totalItems"
        @page-change="handlePageChange"
        @rows-per-page-change="handleRowsPerPageChange"
      />
    </div>

    <!-- Member Action Dialogs -->
    <MemberActionDialogs
      :is-form-open="isFormOpen"
      :is-details-open="isDetailsOpen"
      :is-delete-dialog-open="isDeleteDialogOpen"
      :selected-member="selectedMember"
      :is-edit-mode="isEditMode"
      @close-form="handleFormCancel"
      @close-details="handleDetailsClose"
      @close-delete="isDeleteDialogOpen = false"
      @confirm-delete="confirmDelete"
      @submit-form="handleFormSubmit"
    />

    <!-- Export Dialog -->
    <ExportMembersDialog
      :is-open="isExportDialogOpen"
      @close="isExportDialogOpen = false"
      @export="handleExportSubmit"
    />

    <!-- Import Dialog -->
    <ImportMembersDialog
      :is-open="isImportDialogOpen"
      @close="isImportDialogOpen = false"
      @import="handleImportSubmit"
    />
  </DashboardLayout>
</template>
