<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '@/features/settings/components/SettingsSidebar.vue'
import { useChurchEvents } from '../composables/useChurchEvents'
import EventsList from '../components/EventsList.vue'
import EventFormSheet from '../components/EventFormSheet.vue'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarPlus } from 'lucide-vue-next'

const {
  events,
  loading,
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  loadEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = useChurchEvents()

// Local state
const isSheetOpen = ref(false)
const selectedEvent = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

/**
 * Load events with current filters
 */
async function handleLoadEvents() {
  await loadEvents({ search: searchQuery.value || undefined })
}

/**
 * Handle create new event
 */
function handleCreate() {
  selectedEvent.value = null
  isSheetOpen.value = true
}

/**
 * Handle edit event
 */
function handleEdit(event) {
  selectedEvent.value = event
  isSheetOpen.value = true
}

/**
 * Handle delete event
 */
async function handleDelete(event) {
  const confirmed = confirm(`Are you sure you want to delete ${event.name}?`)
  if (confirmed) {
    await deleteEvent(event.id)
  }
}

/**
 * Handle form save
 */
async function handleSave(data) {
  isSaving.value = true
  
  try {
    if (selectedEvent.value) {
      // Update existing
      await updateEvent(selectedEvent.value.id, data)
    } else {
      // Create new
      await createEvent(data)
    }
    
    if (isSheetOpen.value) {
      isSheetOpen.value = false
    }
    
    // Refresh list
    await handleLoadEvents()
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle page change
 */
function handlePageChange(page) {
  loadEvents({ page })
}

/**
 * Handle per page change
 */
function handlePerPageChange(newPerPage) {
  loadEvents({ perPage: newPerPage, page: 1 })
}

/**
 * Handle search
 */
function handleSearch(value) {
  searchQuery.value = value
  loadEvents({ page: 1, search: value })
}

/**
 * Handle sheet close
 */
function handleClose() {
  isSheetOpen.value = false
  selectedEvent.value = null
}

// Lifecycle
onMounted(() => {
  handleLoadEvents()
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
              <h2 class="text-2xl font-bold text-foreground">Events Management</h2>
              <p class="text-muted-foreground mt-1">
                Manage your church events and activities
              </p>
            </div>
            <Button @click="handleCreate">
              <CalendarPlus class="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>

          <!-- Info Card -->
          <Card>
            <CardHeader>
              <CardTitle>Church Events</CardTitle>
              <CardDescription>
                Add and manage upcoming church events, celebrations, and special services
              </CardDescription>
            </CardHeader>
          </Card>

          <!-- Events List with Pagination -->
          <EventsList
            :events="events"
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

    <!-- Event Form Sheet -->
    <EventFormSheet
      :is-open="isSheetOpen"
      :event="selectedEvent"
      :is-saving="isSaving"
      @close="handleClose"
      @save="handleSave"
    />
  </DashboardLayout>
</template>
