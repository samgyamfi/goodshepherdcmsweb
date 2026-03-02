<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-vue-next'

/**
 * MemberGroupsList Component
 * Displays member's group memberships
 * 
 * @props {Object} member - Member object with groupMemberships
 */

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

/**
 * Get groups from member data
 * Supports both direct groups array and groupMemberships
 * @returns {Array} Array of groups
 */
const groups = computed(() => {
  if (!props.member) return []
  
  // Check for groupMemberships (with pivot data)
  if (props.member.groupMemberships && props.member.groupMemberships.length > 0) {
    return props.member.groupMemberships.map((membership) => ({
      id: membership.group?.id || membership.group?.uuid || membership.id,
      name: membership.group?.name || membership.name,
      joinedAt: membership.pivot?.joined_at || membership.joined_at,
    }))
  }
  
  // Check for direct groups array
  if (props.member.groups && props.member.groups.length > 0) {
    return props.member.groups.map((group) => ({
      id: group.id || group.uuid,
      name: group.name,
      joinedAt: group.pivot?.joined_at || group.joined_at,
    }))
  }
  
  return []
})

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date
  }
}
</script>

<template>
  <Card v-if="groups.length > 0">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Users class="h-5 w-5" />
        Groups
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="group in groups"
          :key="group.id"
          variant="secondary"
          class="gap-1"
        >
          {{ group.name }}
          <span v-if="group.joinedAt" class="ml-1 text-xs opacity-70">
            ({{ formatDate(group.joinedAt) }})
          </span>
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
