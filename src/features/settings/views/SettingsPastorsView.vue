<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '@/features/settings/components/SettingsSidebar.vue'
import { usePastors } from '../composables/usePastors'
import PastorsList from '../components/PastorsList.vue'
import PastorFormSheet from '../components/PastorFormSheet.vue'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-vue-next'
import { useConfirm } from '@/composables/useConfirm'

const {
  pastors,
  loading,
  pagination,
  searchQuery,
  loadPastors,
  createPastor,
  updatePastor,
  deletePastor,
  reorderPastors,
  handlePageChange,
  handlePerPageChange,
  handleSearch,
} = usePastors()

const { confirm } = useConfirm()

const isSheetOpen = ref(false)
const selectedPastor = ref(null)
const isSaving = ref(false)

function handleCreate() {
  selectedPastor.value = null
  isSheetOpen.value = true
}

function handleEdit(pastor) {
  selectedPastor.value = pastor
  isSheetOpen.value = true
}

async function handleDelete(pastor) {
  const ok = await confirm({
    title:        `Delete ${pastor.title ?? ''} ${pastor.first_name} ${pastor.last_name}`.trim(),
    description:  'This pastor will be permanently removed from your church. This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel:  'Keep',
  })
  if (!ok) return
  await deletePastor(pastor.id)
}

async function handleSave(data) {
  isSaving.value = true
  try {
    const success = selectedPastor.value
      ? await updatePastor(selectedPastor.value.id, data)
      : await createPastor(data)

    if (success) {
      isSheetOpen.value = false
      selectedPastor.value = null
    }
  } finally {
    isSaving.value = false
  }
}

async function handleReorder(orders) {
  const ok = await reorderPastors(orders)
  if (ok) loadPastors()
}

function handleClose() {
  isSheetOpen.value = false
  selectedPastor.value = null
}

onMounted(() => {
  loadPastors()
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
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-foreground">Pastors Management</h2>
              <p class="text-muted-foreground mt-1">Manage your church pastors and clergy</p>
            </div>
            <Button @click="handleCreate">
              <UserPlus class="mr-2 h-4 w-4" />
              Add Pastor
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pastors & Clergy</CardTitle>
              <CardDescription>
                Add and manage pastors, reverends, bishops, and other clergy members
              </CardDescription>
            </CardHeader>
          </Card>

          <PastorsList
            :pastors="pastors"
            :loading="loading"
            :pagination="pagination"
            :search-query="searchQuery"
            @edit="handleEdit"
            @delete="handleDelete"
            @reorder="handleReorder"
            @page-change="handlePageChange"
            @per-page-change="handlePerPageChange"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>

    <PastorFormSheet
      :is-open="isSheetOpen"
      :pastor="selectedPastor"
      :is-saving="isSaving"
      @close="handleClose"
      @save="handleSave"
    />
  </DashboardLayout>
</template>
