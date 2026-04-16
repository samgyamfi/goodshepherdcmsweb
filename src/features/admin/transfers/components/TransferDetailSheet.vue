<script setup>
import { ref, watch, computed } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TransferRequestStatus } from '@/enums'
import { User, Building2, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  request: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'approve', 'reject'])

const rejectReason = ref('')

watch(() => props.request, (newRequest) => {
  if (newRequest) {
    rejectReason.value = newRequest.reject_reason || ''
  }
})

const formatDate = computed(() => {
  if (!props.request?.created_at) return ''
  return new Date(props.request.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

function handleApprove() {
  emit('approve', props.request)
}

function handleReject() {
  emit('reject', props.request, rejectReason.value || 'Rejected by admin')
}

function handleClose() {
  rejectReason.value = ''
  emit('close')
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="handleClose">
    <SheetContent class="sm:max-w-xl overflow-y-auto">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <Building2 class="h-5 w-5" />
          Transfer Request Details
        </SheetTitle>
        <SheetDescription>
          Review and manage church transfer request
        </SheetDescription>
      </SheetHeader>

      <div v-if="request" class="space-y-6 py-4">
        <!-- Status Badge -->
        <div class="flex items-center justify-center">
          <Badge :variant="TransferRequestStatus.badgeVariant(request.status)" class="text-sm px-4 py-2">
            {{ TransferRequestStatus.label(request.status) }}
          </Badge>
        </div>

        <Separator />

        <!-- Member Info -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            <User class="h-4 w-4 text-primary" />
            <span>Member Information</span>
          </div>
          <div class="pl-6 space-y-1 text-sm">
            <p><span class="text-muted-foreground">Name:</span> {{ request.user?.full_name }}</p>
            <p><span class="text-muted-foreground">Email:</span> {{ request.user?.email || 'N/A' }}</p>
            <p><span class="text-muted-foreground">Phone:</span> {{ request.user?.phone || 'N/A' }}</p>
          </div>
        </div>

        <Separator />

        <!-- Church Transfer Info -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            <Building2 class="h-4 w-4 text-primary" />
            <span>Transfer Details</span>
          </div>
          <div class="pl-6 space-y-2 text-sm">
            <div>
              <p class="text-muted-foreground">From Church</p>
              <p class="font-medium">{{ request.from_church?.name ?? 'N/A' }}</p>
              <p class="text-xs text-muted-foreground">{{ request.from_church?.city }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">To Church</p>
              <p class="font-medium">{{ request.to_church?.name ?? 'N/A' }}</p>
              <p class="text-xs text-muted-foreground">{{ request.to_church?.city }}</p>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Dates -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            <Calendar class="h-4 w-4 text-primary" />
            <span>Request Information</span>
          </div>
          <div class="pl-6 space-y-1 text-sm">
            <p><span class="text-muted-foreground">Requested:</span> {{ formatDate }}</p>
            <p v-if="request.updated_at">
              <span class="text-muted-foreground">Last Updated:</span>
              {{ new Date(request.updated_at).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Reason -->
        <div v-if="request.reason" class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            <MessageSquare class="h-4 w-4 text-primary" />
            <span>Reason for Transfer</span>
          </div>
          <div class="pl-6">
            <p class="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {{ request.reason }}
            </p>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div v-if="request.status === 'rejected' && request.reject_reason" class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            <XCircle class="h-4 w-4 text-destructive" />
            <span>Rejection Reason</span>
          </div>
          <div class="pl-6">
            <p class="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-lg">
              {{ request.reject_reason }}
            </p>
          </div>
        </div>

        <!-- Actions for Pending Requests -->
        <div v-if="TransferRequestStatus.isPending(request.status)" class="space-y-3">
          <Separator />
          <div class="space-y-3">
            <Label for="reject-reason">Rejection Reason (Optional)</Label>
            <Textarea
              id="reject-reason"
              v-model="rejectReason"
              placeholder="Enter reason for rejection..."
              rows="3"
            />
          </div>

          <div class="flex gap-2">
            <Button class="flex-1" variant="default" @click="handleApprove">
              <CheckCircle class="mr-2 h-4 w-4" />
              Approve Transfer
            </Button>
            <Button class="flex-1" variant="destructive" @click="handleReject">
              <XCircle class="mr-2 h-4 w-4" />
              Reject Transfer
            </Button>
          </div>
        </div>
      </div>

      <SheetFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Close
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
