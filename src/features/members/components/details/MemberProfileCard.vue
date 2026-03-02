<script setup>
import { computed } from 'vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail } from 'lucide-vue-next'

/**
 * MemberProfileCard Component
 * Displays member profile header with avatar, name, and contact info
 * 
 * @props {Object} member - Member object with profile information
 */

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

/**
 * Get initials from member name
 * @returns {string} Initials string
 */
const initials = computed(() => {
  const first = props.member?.first_name?.[0] || ''
  const last = props.member?.last_name?.[0] || ''
  return (first + last).toUpperCase() || 'M'
})

/**
 * Get full member name
 * @returns {string} Full name
 */
const memberName = computed(() => {
  if (!props.member) return ''
  return `${props.member.first_name} ${props.member.last_name}`
})

/**
 * Get status badge variant
 * @param {string} status - Member status
 * @returns {string} Badge variant
 */
function getStatusVariant(status) {
  const variants = {
    active: 'default',
    pending: 'secondary',
    pending_approval: 'secondary',
    suspended: 'destructive',
    inactive: 'outline',
  }
  return variants[status?.toLowerCase()] || 'outline'
}

/**
 * Get membership status badge variant
 * @param {string} status - Membership status
 * @returns {string} Badge variant
 */
function getMembershipStatusVariant(status) {
  const variants = {
    active: 'default',
    inactive: 'outline',
    visitor: 'secondary',
    transferred: 'secondary',
  }
  return variants[status?.toLowerCase()] || 'outline'
}
</script>

<template>
  <div class="flex items-start justify-between">
    <div class="flex items-center gap-4">
      <Avatar class="h-16 w-16">
        <AvatarFallback class="bg-primary/10 text-primary text-xl font-medium">
          {{ initials }}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 class="text-2xl font-bold">
          {{ memberName }}
        </h2>
        <div class="flex items-center gap-2 mt-1">
          <Badge :variant="getStatusVariant(member?.status)" class="capitalize">
            {{ member?.status || 'Active' }}
          </Badge>
          <Badge :variant="getMembershipStatusVariant(member?.membership_status)" class="capitalize">
            {{ member?.membership_status || 'Active Member' }}
          </Badge>
        </div>
        <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div v-if="member?.phone" class="flex items-center gap-1">
            <Phone class="h-3 w-3" />
            <span>{{ member.phone }}</span>
          </div>
          <div v-if="member?.email" class="flex items-center gap-1">
            <Mail class="h-3 w-3" />
            <span>{{ member.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
