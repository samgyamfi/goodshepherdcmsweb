<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import { useTransferRequests } from './composables/useTransferRequests'
import TransferRequestList from './components/TransferRequestList.vue'
import TransferRequestDialog from './components/TransferRequestDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UserPlus, Clock, CheckCircle } from 'lucide-vue-next'

const {
  myRequests,
  churchRequests,
  loading,
  pendingCount,
  canViewChurchRequests,
  fetchMyRequests,
  fetchChurchRequests,
  createTransferRequest,
  approveRequest,
  rejectRequest,
  cancelRequest,
} = useTransferRequests()

// Local state
const isTransferDialogOpen = ref(false)
const activeTab = ref('my-requests')

/**
 * Handle create transfer request
 */
async function handleCreateRequest(data) {
  const success = await createTransferRequest(data.toChurchId, data.reason)
  if (success) {
    isTransferDialogOpen.value = false
  }
}

/**
 * Handle approve request
 */
async function handleApprove(request) {
  const confirmed = confirm(
    `Are you sure you want to approve ${request.user?.full_name}'s transfer request?`,
  )
  if (confirmed) {
    await approveRequest(request.id)
  }
}

/**
 * Handle reject request
 */
async function handleReject(request) {
  const reason = prompt('Enter reason for rejection (optional):')
  await rejectRequest(request.id, reason || 'No reason provided')
}

/**
 * Handle cancel request
 */
async function handleCancel(request) {
  const confirmed = confirm('Are you sure you want to cancel this transfer request?')
  if (confirmed) {
    await cancelRequest(request.id)
  }
}

// Lifecycle
onMounted(() => {
  fetchMyRequests()
  fetchChurchRequests()
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Church Transfer Requests</h1>
          <p class="text-muted-foreground mt-1">Manage your church transfer requests</p>
        </div>
        <Button @click="isTransferDialogOpen = true">
          <UserPlus class="mr-2 h-4 w-4" />
          Request Transfer
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">My Requests</CardTitle>
            <Clock class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ myRequests.length }}</div>
            <p class="text-xs text-muted-foreground">{{ pendingCount }} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Church Requests</CardTitle>
            <UserPlus class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ churchRequests.length }}</div>
            <p class="text-xs text-muted-foreground">Incoming transfers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Pending Approval</CardTitle>
            <CheckCircle class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ pendingCount }}</div>
            <p class="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      <!-- Tabs -->
      <TabsRoot v-model="activeTab" class="mt-6">
        <TabsList class="grid" :class="canViewChurchRequests ? 'w-full max-w-md grid-cols-2' : 'w-full max-w-[200px] grid-cols-1'">
          <TabsTrigger value="my-requests"> My Requests </TabsTrigger>
          <TabsTrigger v-if="canViewChurchRequests" value="church-requests"> Church Requests </TabsTrigger>
        </TabsList>

        <!-- My Requests Tab -->
        <TabsContent value="my-requests" class="mt-6">
          <TransferRequestList
            :requests="myRequests"
            :loading="loading"
            :show-actions="true"
            :can-cancel="true"
            @cancel="handleCancel"
          />
        </TabsContent>

        <!-- Church Requests Tab -->
        <TabsContent v-if="canViewChurchRequests" value="church-requests" class="mt-6">
          <TransferRequestList
            :requests="churchRequests"
            :loading="loading"
            :show-actions="true"
            :can-approve="true"
            @approve="handleApprove"
            @reject="handleReject"
          />
        </TabsContent>
      </TabsRoot>
    </div>

    <!-- Transfer Request Dialog -->
    <TransferRequestDialog
      :is-open="isTransferDialogOpen"
      @close="isTransferDialogOpen = false"
      @submitted="handleCreateRequest"
    />
  </DashboardLayout>
</template>
