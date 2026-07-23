<script setup>
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreVertical, Eye, Pencil, CheckCircle, PauseCircle, Trash2, ShieldCheck } from 'lucide-vue-next'
import { UserStatus, MembershipStatus } from '@/enums'

defineProps({
  members: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  canManage: {
    type: Boolean,
    default: true,
  },
  canDelete: {
    type: Boolean,
    default: false,
  },
  canManagePermissions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view', 'edit', 'approve', 'suspend', 'delete', 'permissions'])

// Get initials from name
function getInitials(firstName, lastName) {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'M'
}

// ── Status helpers — delegate to enums ────────────────────────────────────────
function getStatusVariant(status) {
  return UserStatus.badgeVariant(status)
}

function getStatusLabel(status) {
  return UserStatus.label(status)
}

function getMembershipStatusVariant(status) {
  return MembershipStatus.badgeVariant(status)
}

// Handle action clicks
function handleView(member) {
  emit('view', member)
}

function handleEdit(member) {
  emit('edit', member)
}

function handleApprove(member) {
  emit('approve', member)
}

function handleSuspend(member) {
  emit('suspend', member)
}

function handleDelete(member) {
  emit('delete', member)
}

function handlePermissions(member) {
  emit('permissions', member)
}

// Delegates to UserStatus enum — no raw strings
function canApprove(member) {
  return UserStatus.canApprove(member.status)
}

function canSuspend(member) {
  return UserStatus.canSuspend(member.status)
}
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[60px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Membership Status</TableHead>
          <TableHead>Groups</TableHead>
          <TableHead v-if="canManage" class="w-[80px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <!-- Loading state -->
        <template v-if="loading">
          <TableRow v-for="i in 5" :key="i">
            <TableCell>
              <Skeleton class="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell>
              <div class="space-y-2">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-3 w-48" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton class="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6 w-32 rounded-full" />
            </TableCell>
            <TableCell v-if="canManage">
              <Skeleton class="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        </template>

        <!-- Empty state -->
        <template v-else-if="members.length === 0">
          <TableRow>
            <TableCell :colspan="canManage ? 8 : 7" class="h-24 text-center">
              <div class="flex flex-col items-center justify-center text-muted-foreground">
                <svg
                  class="h-12 w-12 mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span class="text-sm">No members found</span>
              </div>
            </TableCell>
          </TableRow>
        </template>

        <!-- Members data -->
        <template v-else>
          <TableRow v-for="member in members" :key="member.uuid || member.id">
            <TableCell>
              <Avatar class="h-10 w-10">
                <AvatarFallback class="bg-primary/10 text-primary text-sm font-medium">
                  {{ getInitials(member.first_name, member.last_name) }}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span class="font-medium">{{ member.first_name }} {{ member.last_name }}</span>
                <span v-if="member.occupation" class="text-xs text-muted-foreground">
                  {{ member.occupation }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ member.phone || '-' }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ member.email || '-' }}
            </TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(member.status)" class="capitalize">
                {{ getStatusLabel(member.status) }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                :variant="getMembershipStatusVariant(member.membership_status)"
                class="capitalize"
              >
                {{ member.membership_status || 'Active' }}
              </Badge>
            </TableCell>
            <TableCell>
              <div v-if="member.groups && member.groups.length > 0" class="flex flex-wrap gap-1">
                <Badge
                  v-for="group in member.groups.slice(0, 2)"
                  :key="group.id || group.uuid"
                  variant="outline"
                  class="text-xs"
                >
                  {{ group.name }}
                </Badge>
                <Badge v-if="member.groups.length > 2" variant="secondary" class="text-xs">
                  +{{ member.groups.length - 2 }}
                </Badge>
              </div>
              <span v-else class="text-muted-foreground text-sm">-</span>
            </TableCell>
            <!-- add canManage check if true show the dropdown menu -->
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <MoreVertical class="h-4 w-4" />
                    <span class="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleView(member)">
                    <Eye class="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleEdit(member)">
                    <Pencil class="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="canManagePermissions"
                    @click="handlePermissions(member)"
                  >
                    <ShieldCheck class="mr-2 h-4 w-4" />
                    Manage Permissions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator v-if="canApprove(member) || canSuspend(member)" />
                  <DropdownMenuItem
                    v-if="canApprove(member)"
                    @click="handleApprove(member)"
                    class="text-green-600"
                  >
                    <CheckCircle class="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="canSuspend(member)"
                    @click="handleSuspend(member)"
                    class="text-amber-600"
                  >
                    <PauseCircle class="mr-2 h-4 w-4" />
                    Suspend
                  </DropdownMenuItem>
                  <DropdownMenuSeparator v-if="canDelete" />
                  <DropdownMenuItem
                    v-if="canDelete"
                    @click="handleDelete(member)"
                    class="text-red-600"
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
