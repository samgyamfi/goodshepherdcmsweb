<script setup>
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, XCircle, Clock, User, Building } from 'lucide-vue-next'
import { TransferRequestStatus } from '@/enums'

defineProps({
  requests: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  canApprove: {
    type: Boolean,
    default: false,
  },
  canCancel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['approve', 'reject', 'cancel'])

// ── Status helpers — delegate to TransferRequestStatus enum ──────────────────
function getStatusVariant(status) {
  return TransferRequestStatus.badgeVariant(status)
}

function getStatusLabel(status) {
  return TransferRequestStatus.label(status)
}

function getStatusIcon(status) {
  const icons = {
    [TransferRequestStatus.PENDING]:   Clock,
    [TransferRequestStatus.APPROVED]:  CheckCircle,
    [TransferRequestStatus.REJECTED]:  XCircle,
    [TransferRequestStatus.CANCELLED]: XCircle,
    [TransferRequestStatus.COMPLETED]: CheckCircle,
  }
  return icons[status] ?? Clock
}

/**
 * Format date
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>From Church</TableHead>
          <TableHead>To Church</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested Date</TableHead>
          <TableHead v-if="showActions">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow v-for="i in 3" :key="i">
            <TableCell>
              <Skeleton class="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-4 w-28" />
            </TableCell>
            <TableCell v-if="showActions">
              <Skeleton class="h-8 w-24" />
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="requests.length === 0">
          <TableRow>
            <TableCell :colspan="showActions ? 6 : 5" class="text-center py-8">
              <div class="flex flex-col items-center gap-2 text-muted-foreground">
                <User class="h-12 w-12 opacity-20" />
                <p>No transfer requests found</p>
              </div>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow v-for="request in requests" :key="request.id">
            <TableCell>
              <div class="flex items-center gap-2">
                <User class="h-4 w-4 text-muted-foreground" />
                <div>
                  <div class="font-medium">{{ request.user?.full_name }}</div>
                  <div class="text-xs text-muted-foreground">{{ request.user?.email }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Building class="h-4 w-4 text-muted-foreground" />
                {{ request.from_church?.name }}
              </div>
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Building class="h-4 w-4 text-muted-foreground" />
                {{ request.to_church?.name }}
              </div>
            </TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(request.status)">
                <component :is="getStatusIcon(request.status)" class="mr-1 h-3 w-3" />
                {{ getStatusLabel(request.status) }}
              </Badge>
            </TableCell>
            <TableCell>{{ formatDate(request.created_at) }}</TableCell>
            <TableCell v-if="showActions">
              <div class="flex gap-2">
                <Button
                  v-if="canApprove && TransferRequestStatus.isPending(request.status)"
                  variant="default"
                  size="sm"
                  @click="emit('approve', request)"
                >
                  Approve
                </Button>
                <Button
                  v-if="canApprove && TransferRequestStatus.isPending(request.status)"
                  variant="outline"
                  size="sm"
                  @click="emit('reject', request)"
                >
                  Reject
                </Button>
                <Button
                  v-if="canCancel && TransferRequestStatus.isPending(request.status)"
                  variant="outline"
                  size="sm"
                  @click="emit('cancel', request)"
                >
                  Cancel
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
