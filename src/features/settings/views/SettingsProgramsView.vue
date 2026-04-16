<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '@/features/settings/components/SettingsSidebar.vue'
import { useChurchPrograms } from '../composables/useChurchPrograms'
import ProgramsList from '../components/ProgramsList.vue'
import ProgramFormSheet from '../components/ProgramFormSheet.vue'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarPlus } from 'lucide-vue-next'

const {
  programs,
  loading,
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  loadPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} = useChurchPrograms()

// Local state
const isSheetOpen = ref(false)
const selectedProgram = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

/**
 * Load programs with current filters
 */
async function handleLoadPrograms() {
  await loadPrograms({ search: searchQuery.value || undefined })
}

/**
 * Handle create new program
 */
function handleCreate() {
  selectedProgram.value = null
  isSheetOpen.value = true
}

/**
 * Handle edit program
 */
function handleEdit(program) {
  selectedProgram.value = program
  isSheetOpen.value = true
}

/**
 * Handle delete program
 */
async function handleDelete(program) {
  const confirmed = confirm(`Are you sure you want to delete ${program.name}?`)
  if (confirmed) {
    await deleteProgram(program.id)
  }
}

/**
 * Handle form save
 */
async function handleSave(data) {
  isSaving.value = true
  
  try {
    if (selectedProgram.value) {
      // Update existing
      await updateProgram(selectedProgram.value.id, data)
    } else {
      // Create new
      await createProgram(data)
    }
    
    if (isSheetOpen.value) {
      isSheetOpen.value = false
    }
    
    // Refresh list
    await handleLoadPrograms()
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle page change
 */
function handlePageChange(page) {
  loadPrograms({ page })
}

/**
 * Handle per page change
 */
function handlePerPageChange(newPerPage) {
  loadPrograms({ perPage: newPerPage, page: 1 })
}

/**
 * Handle search
 */
function handleSearch(value) {
  searchQuery.value = value
  loadPrograms({ page: 1, search: value })
}

/**
 * Handle sheet close
 */
function handleClose() {
  isSheetOpen.value = false
  selectedProgram.value = null
}

// Lifecycle
onMounted(() => {
  handleLoadPrograms()
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Settings</h1>
        <p class="text-muted-foreground mt-2">Manage system settings and configuration</p>
      </div>

      <div class="grid gap-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar />

        <div class="space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-foreground">Programs Management</h2>
              <p class="text-muted-foreground mt-1">
                Manage your church programs and activities
              </p>
            </div>
            <Button @click="handleCreate">
              <CalendarPlus class="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </div>

          <!-- Info Card -->
          <Card>
            <CardHeader>
              <CardTitle>Church Programs</CardTitle>
              <CardDescription>
                Add and manage regular church programs, services, and activities
              </CardDescription>
            </CardHeader>
          </Card>

          <!-- Programs List with Pagination -->
          <ProgramsList
            :programs="programs"
            :loading="loading"
            :pagination="{ currentPage, lastPage, perPage, total, from, to }"
            :search-query="searchQuery"
            @edit="handleEdit"
            @delete="handleDelete"
            @page-change="handlePageChange"
            @per-page-change="handlePerPageChange"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Program Form Sheet -->
    <ProgramFormSheet
      :is-open="isSheetOpen"
      :program="selectedProgram"
      :is-saving="isSaving"
      @close="handleClose"
      @save="handleSave"
    />
  </DashboardLayout>
</template>
