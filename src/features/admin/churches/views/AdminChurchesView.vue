<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAdminChurches } from '../composables/useAdminChurches'
import { useAdminTrashedChurches } from '../composables/useAdminTrashedChurches'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import { useChurchStore } from '@/stores/church'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import ChurchesList from '../components/ChurchesList.vue'
import { Building2 } from 'lucide-vue-next'

const router      = useRouter()
const adminStore  = useAdminDashboardStore()
const churchStore = useChurchStore()
const { confirm } = useConfirm()

const activeTab = ref('active')

// ── Active churches ────────────────────────────────────────────────────────────
const {
  churches,
  loading: activeLoading,
  pagination: activePagination,
  searchQuery: activeSearch,
  loadChurches,
  handlePageChange:    handleActivePageChange,
  handlePerPageChange: handleActivePerPageChange,
  handleSearch:        handleActiveSearch,
} = useAdminChurches()

// ── Deleted / trashed churches ─────────────────────────────────────────────────
const {
  trashedChurches,
  loading: trashedLoading,
  pagination: trashedPagination,
  searchQuery: trashedSearch,
  loadTrashedChurches,
  handlePageChange:    handleTrashedPageChange,
  handlePerPageChange: handleTrashedPerPageChange,
  handleSearch:        handleTrashedSearch,
} = useAdminTrashedChurches()

function onTabChange(tab) {
  activeTab.value = tab
  if (tab === 'deleted') loadTrashedChurches()
}

// ── Active tab actions ────────────────────────────────────────────────────────
function handleViewLanding(church) {
  window.open(`/?church=${church.uuid}`, '_blank')
}

async function handleAccessSettings(church) {
  showToast.info(`Loading ${church.name} settings…`)
  const ok = await churchStore.fetchLandingPageData(church.uuid)
  if (!ok) {
    showToast.error('Could not load church data. Please try again.')
    return
  }
  router.push({ name: 'settings' })
}

async function handleToggleStatus(church) {
  const ok = await confirm({
    title:        `${church.is_active ? 'Deactivate' : 'Activate'} ${church.name}?`,
    description:  church.is_active
      ? 'Members of this church will lose access to the church dashboard until it is reactivated.'
      : 'This church and its members will regain access to the church dashboard.',
    confirmLabel: church.is_active ? 'Deactivate' : 'Activate',
    cancelLabel:  'Cancel',
    variant:      church.is_active ? 'destructive' : 'default',
  })
  if (!ok) return

  const success = await adminStore.toggleChurchStatus(church.uuid)
  if (success) {
    showToast.success(`Church ${church.is_active ? 'deactivated' : 'activated'} successfully.`)
    loadChurches()
  } else {
    showToast.error('Failed to update church status.')
  }
}

async function handleDelete(church) {
  const ok = await confirm({
    title:        `Move "${church.name}" to Trash?`,
    description:  'The church will be deactivated and can be restored later from the Deleted tab.',
    confirmLabel: 'Move to Trash',
    cancelLabel:  'Cancel',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.deleteChurch(church.uuid)
  if (success) {
    showToast.success('Church moved to trash.')
    loadChurches()
  } else {
    showToast.error('Failed to delete church.')
  }
}

async function handleBulkDelete(ids) {
  const ok = await confirm({
    title:        `Move ${ids.length} church(es) to Trash?`,
    description:  'They can be restored from the Deleted tab.',
    confirmLabel: 'Move to Trash',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.bulkChurchAction('delete', ids)
  if (success) {
    showToast.success(`${ids.length} church(es) moved to trash.`)
    loadChurches()
  }
}

// ── Deleted tab actions ───────────────────────────────────────────────────────
async function handleRestore(church) {
  const ok = await confirm({
    title:        `Restore "${church.name}"?`,
    description:  'The church will be restored and become accessible again.',
    confirmLabel: 'Restore',
    cancelLabel:  'Cancel',
  })
  if (!ok) return

  const success = await adminStore.restoreChurch(church.uuid)
  if (success) {
    showToast.success('Church restored successfully.')
    loadTrashedChurches()
  } else {
    showToast.error('Failed to restore church.')
  }
}

async function handleForceDelete(church) {
  const ok = await confirm({
    title:        `Permanently delete "${church.name}"?`,
    description:  'This will erase the church and ALL its data (members, events, donations, etc.) forever. This cannot be undone.',
    confirmLabel: 'Delete Forever',
    cancelLabel:  'Cancel',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.forceDeleteChurch(church.uuid)
  if (success) {
    showToast.success('Church permanently deleted.')
    loadTrashedChurches()
  } else {
    showToast.error('Failed to permanently delete church.')
  }
}

async function handleBulkRestore(ids) {
  const ok = await confirm({
    title:        `Restore ${ids.length} church(es)?`,
    confirmLabel: 'Restore All',
  })
  if (!ok) return

  const success = await adminStore.bulkChurchAction('restore', ids)
  if (success) {
    showToast.success(`${ids.length} church(es) restored.`)
    loadTrashedChurches()
  }
}

async function handleBulkForceDelete(ids) {
  const ok = await confirm({
    title:        `Permanently delete ${ids.length} church(es)?`,
    description:  'This action cannot be undone. All data will be erased forever.',
    confirmLabel: 'Delete Forever',
    variant:      'destructive',
  })
  if (!ok) return

  const success = await adminStore.bulkChurchAction('force-delete', ids)
  if (success) {
    showToast.success(`${ids.length} church(es) permanently deleted.`)
    loadTrashedChurches()
  }
}

onMounted(loadChurches)
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
        <Building2 class="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground">Churches</h1>
        <p class="text-sm text-muted-foreground">Manage all churches registered on the platform</p>
      </div>
    </div>

    <!-- Active / Deleted tabs -->
    <TabsRoot :default-value="activeTab" @update:model-value="onTabChange">
      <TabsList class="mb-4">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="deleted">Deleted</TabsTrigger>
      </TabsList>

      <!-- Active churches tab -->
      <TabsContent value="active">
        <ChurchesList
          mode="active"
          :churches="churches"
          :loading="activeLoading"
          :pagination="activePagination"
          :search-query="activeSearch"
          @search="handleActiveSearch"
          @page-change="handleActivePageChange"
          @per-page-change="handleActivePerPageChange"
          @view-landing="handleViewLanding"
          @access-settings="handleAccessSettings"
          @toggle-status="handleToggleStatus"
          @delete="handleDelete"
          @bulk-delete="handleBulkDelete"
        />
      </TabsContent>

      <!-- Deleted churches tab -->
      <TabsContent value="deleted">
        <ChurchesList
          mode="deleted"
          :churches="trashedChurches"
          :loading="trashedLoading"
          :pagination="trashedPagination"
          :search-query="trashedSearch"
          @search="handleTrashedSearch"
          @page-change="handleTrashedPageChange"
          @per-page-change="handleTrashedPerPageChange"
          @restore="handleRestore"
          @force-delete="handleForceDelete"
          @bulk-restore="handleBulkRestore"
          @bulk-force-delete="handleBulkForceDelete"
        />
      </TabsContent>
    </TabsRoot>
  </div>
</template>
