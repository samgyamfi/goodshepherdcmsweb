<script setup>
import { ref, onMounted } from 'vue'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAdminUsers } from '../composables/useAdminUsers'
import { useAdminTrashedUsers } from '../composables/useAdminTrashedUsers'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import UsersList from '../components/UsersList.vue'
import UserDetailSheet from '../components/UserDetailSheet.vue'
import { Users } from 'lucide-vue-next'

const adminStore  = useAdminDashboardStore()
const { confirm } = useConfirm()

const activeTab = ref('active')

// ── Detail sheet ──────────────────────────────────────────────────────────────
const detailSheetOpen = ref(false)
const selectedUser    = ref(null)

function handleViewDetails(user) {
  selectedUser.value   = user
  detailSheetOpen.value = true
}

// ── Active users ──────────────────────────────────────────────────────────────
const {
  users,
  loading: activeLoading,
  pagination: activePagination,
  searchQuery: activeSearch,
  loadUsers,
  handlePageChange:    handleActivePageChange,
  handlePerPageChange: handleActivePerPageChange,
  handleSearch:        handleActiveSearch,
  handleUserTypeFilter: handleActiveTypeFilter,
} = useAdminUsers()

// ── Trashed users ─────────────────────────────────────────────────────────────
const {
  trashedUsers,
  loading: trashedLoading,
  pagination: trashedPagination,
  searchQuery: trashedSearch,
  loadTrashedUsers,
  handlePageChange:    handleTrashedPageChange,
  handlePerPageChange: handleTrashedPerPageChange,
  handleSearch:        handleTrashedSearch,
  handleUserTypeFilter: handleTrashedTypeFilter,
} = useAdminTrashedUsers()

function onTabChange(tab) {
  activeTab.value = tab
  if (tab === 'deleted') loadTrashedUsers()
}

// ── Active tab actions ────────────────────────────────────────────────────────
async function handleDelete(user) {
  const ok = await confirm({
    title:        `Move "${user.full_name}" to Trash?`,
    description:  'The user will be disabled and can be restored later from the Deleted tab.',
    confirmLabel: 'Move to Trash',
    cancelLabel:  'Cancel',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.deleteUser(user.uuid)
  if (success) {
    showToast.success('User moved to trash.')
    loadUsers()
  } else {
    showToast.error('Failed to delete user.')
  }
}

async function handleBulkDelete(ids) {
  const ok = await confirm({
    title:        `Move ${ids.length} user(s) to Trash?`,
    description:  'They can be restored from the Deleted tab.',
    confirmLabel: 'Move to Trash',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.bulkUserAction('delete', ids)
  if (success) {
    showToast.success(`${ids.length} user(s) moved to trash.`)
    loadUsers()
  }
}

// ── Deleted tab actions ───────────────────────────────────────────────────────
async function handleRestore(user) {
  const ok = await confirm({
    title:        `Restore "${user.full_name}"?`,
    description:  'The user account will be restored and will regain access to the platform.',
    confirmLabel: 'Restore',
    cancelLabel:  'Cancel',
  })
  if (!ok) return

  const success = await adminStore.restoreUser(user.uuid)
  if (success) {
    showToast.success('User restored successfully.')
    loadTrashedUsers()
  } else {
    showToast.error('Failed to restore user.')
  }
}

async function handleForceDelete(user) {
  const ok = await confirm({
    title:        `Permanently delete "${user.full_name}"?`,
    description:  'This will erase the account and all associated data forever. This cannot be undone.',
    confirmLabel: 'Delete Forever',
    cancelLabel:  'Cancel',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.forceDeleteUser(user.uuid)
  if (success) {
    showToast.success('User permanently deleted.')
    loadTrashedUsers()
  } else {
    showToast.error('Failed to permanently delete user.')
  }
}

async function handleBulkRestore(ids) {
  const ok = await confirm({
    title:        `Restore ${ids.length} user(s)?`,
    confirmLabel: 'Restore All',
  })
  if (!ok) return

  const success = await adminStore.bulkUserAction('restore', ids)
  if (success) {
    showToast.success(`${ids.length} user(s) restored.`)
    loadTrashedUsers()
  }
}

async function handleBulkForceDelete(ids) {
  const ok = await confirm({
    title:        `Permanently delete ${ids.length} user(s)?`,
    description:  'This action cannot be undone. All data will be erased forever.',
    confirmLabel: 'Delete Forever',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.bulkUserAction('force-delete', ids)
  if (success) {
    showToast.success(`${ids.length} user(s) permanently deleted.`)
    loadTrashedUsers()
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 shrink-0">
        <Users class="h-5 w-5 text-violet-500" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground">Users</h1>
        <p class="text-sm text-muted-foreground">Manage all users registered on the platform</p>
      </div>
    </div>

    <!-- Active / Deleted tabs -->
    <TabsRoot :default-value="activeTab" @update:model-value="onTabChange">
      <TabsList class="mb-4">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="deleted">Deleted</TabsTrigger>
      </TabsList>

      <!-- Active users tab -->
      <TabsContent value="active">
        <UsersList
          mode="active"
          :users="users"
          :loading="activeLoading"
          :pagination="activePagination"
          :search-query="activeSearch"
          @search="handleActiveSearch"
          @filter-type="handleActiveTypeFilter"
          @page-change="handleActivePageChange"
          @per-page-change="handleActivePerPageChange"
          @view-details="handleViewDetails"
          @delete="handleDelete"
          @bulk-delete="handleBulkDelete"
        />
      </TabsContent>

      <!-- Deleted users tab -->
      <TabsContent value="deleted">
        <UsersList
          mode="deleted"
          :users="trashedUsers"
          :loading="trashedLoading"
          :pagination="trashedPagination"
          :search-query="trashedSearch"
          @search="handleTrashedSearch"
          @filter-type="handleTrashedTypeFilter"
          @page-change="handleTrashedPageChange"
          @per-page-change="handleTrashedPerPageChange"
          @view-details="handleViewDetails"
          @restore="handleRestore"
          @force-delete="handleForceDelete"
          @bulk-restore="handleBulkRestore"
          @bulk-force-delete="handleBulkForceDelete"
        />
      </TabsContent>
    </TabsRoot>
  </div>

  <!-- User detail sheet (read-only for super admin) -->
  <UserDetailSheet
    :open="detailSheetOpen"
    :user="selectedUser"
    @update:open="detailSheetOpen = $event"
  />
</template>
