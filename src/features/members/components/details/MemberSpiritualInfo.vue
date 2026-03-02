<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Heart, BookOpen, Users, MessageSquare, UserCheck, Calendar } from 'lucide-vue-next'

/**
 * MemberSpiritualInfo Component
 * Displays member spiritual information details
 * 
 * @props {Object} member - Member object with spiritual information
 */

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return 'Not set'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return date
  }
}

/**
 * Check if spiritual info has content
 * @returns {boolean} Whether spiritual info exists
 */
const hasSpiritualInfo = computed(() => {
  const m = props.member
  return !!(
    m?.is_baptized !== undefined ||
    m?.baptism_date ||
    m?.membership_date ||
    m?.spiritual_gifts ||
    m?.ministry_interests ||
    m?.prayer_requests ||
    m?.share_contact_info !== undefined
  )
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Heart class="h-5 w-5" />
        Spiritual Information
      </CardTitle>
    </CardHeader>
    <CardContent v-if="hasSpiritualInfo" class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Baptism Status</p>
          <div class="flex items-center gap-2">
            <UserCheck class="h-4 w-4 text-muted-foreground" />
            <span>{{ member.is_baptized ? 'Baptized' : 'Not baptized' }}</span>
          </div>
        </div>
        <div v-if="member.is_baptized && member.baptism_date" class="space-y-1">
          <p class="text-sm text-muted-foreground">Baptism Date</p>
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4 text-muted-foreground" />
            <span>{{ formatDate(member.baptism_date) }}</span>
          </div>
        </div>
        <div v-if="member.membership_date" class="space-y-1">
          <p class="text-sm text-muted-foreground">Membership Date</p>
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4 text-muted-foreground" />
            <span>{{ formatDate(member.membership_date) }}</span>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Privacy</p>
          <span>{{ member.share_contact_info ? 'Contact info is shared' : 'Contact info is private' }}</span>
        </div>
      </div>

      <Separator v-if="member.spiritual_gifts || member.ministry_interests || member.prayer_requests" />

      <div v-if="member.spiritual_gifts" class="space-y-2">
        <div class="flex items-center gap-2">
          <BookOpen class="h-4 w-4 text-muted-foreground" />
          <p class="text-sm font-medium">Spiritual Gifts</p>
        </div>
        <p class="text-sm text-muted-foreground">{{ member.spiritual_gifts }}</p>
      </div>

      <div v-if="member.ministry_interests" class="space-y-2">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-muted-foreground" />
          <p class="text-sm font-medium">Ministry Interests</p>
        </div>
        <p class="text-sm text-muted-foreground">{{ member.ministry_interests }}</p>
      </div>

      <div v-if="member.prayer_requests" class="space-y-2">
        <div class="flex items-center gap-2">
          <MessageSquare class="h-4 w-4 text-muted-foreground" />
          <p class="text-sm font-medium">Prayer Requests</p>
        </div>
        <p class="text-sm text-muted-foreground">{{ member.prayer_requests }}</p>
      </div>
    </CardContent>
    <CardContent v-else class="text-sm text-muted-foreground">
      No spiritual information provided
    </CardContent>
  </Card>
</template>
