<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-vue-next'

/**
 * MemberLocationInfo Component
 * Displays member location/address information
 * 
 * @props {Object} member - Member object with profile and country information
 */

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

/**
 * Check if location info is available
 * @returns {boolean} Whether location info exists
 */
const hasLocationInfo = computed(() => {
  const m = props.member
  return !!(
    m?.address ||
    m?.digital_address ||
    m?.city ||
    m?.state ||
    m?.country ||
    m?.postal_code
  )
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <MapPin class="h-5 w-5" />
        Location Information
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="hasLocationInfo" class="grid gap-4 sm:grid-cols-2">
        <div v-if="member.address" class="space-y-1">
          <p class="text-sm text-muted-foreground">Address</p>
          <div class="flex items-start gap-2">
            <MapPin class="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{{ member.address }}</span>
          </div>
        </div>
        <div v-if="member.digital_address" class="space-y-1">
          <p class="text-sm text-muted-foreground">Digital Address</p>
          <span>{{ member.digital_address }}</span>
        </div>
        <div v-if="member.city" class="space-y-1">
          <p class="text-sm text-muted-foreground">City</p>
          <span>{{ member.city }}</span>
        </div>
        <div v-if="member.state" class="space-y-1">
          <p class="text-sm text-muted-foreground">State/Region</p>
          <span>{{ member.state }}</span>
        </div>
        <div v-if="member.postal_code" class="space-y-1">
          <p class="text-sm text-muted-foreground">Postal Code</p>
          <span>{{ member.postal_code }}</span>
        </div>
        <div v-if="member.country" class="space-y-1">
          <p class="text-sm text-muted-foreground">Country</p>
          <span>{{ member.country }}</span>
        </div>
      </div>
      <div v-else class="text-sm text-muted-foreground">
        No location information provided
      </div>
    </CardContent>
  </Card>
</template>
