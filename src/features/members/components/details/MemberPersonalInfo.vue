<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, Calendar, Briefcase, Users } from 'lucide-vue-next'

/**
 * MemberPersonalInfo Component
 * Displays member personal information details
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
 * Calculate age from date of birth
 * @returns {string} Age or 'Not set'
 */
const age = computed(() => {
  if (!props.member?.date_of_birth) return 'Not set'
  try {
    const birthDate = new Date(props.member.date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age > 0 ? `${age} years` : 'Not set'
  } catch {
    return 'Not set'
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Users class="h-5 w-5" />
        Personal Information
      </CardTitle>
    </CardHeader>
    <CardContent class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Phone</p>
        <div class="flex items-center gap-2">
          <Phone class="h-4 w-4 text-muted-foreground" />
          <span>{{ member.phone || 'Not provided' }}</span>
        </div>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Email</p>
        <div class="flex items-center gap-2">
          <Mail class="h-4 w-4 text-muted-foreground" />
          <span>{{ member.email || 'Not provided' }}</span>
        </div>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Date of Birth</p>
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4 text-muted-foreground" />
          <span>{{ formatDate(member.date_of_birth) }}</span>
        </div>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Age</p>
        <span>{{ age }}</span>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Gender</p>
        <span class="capitalize">{{ member.gender || 'Not specified' }}</span>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Marital Status</p>
        <span class="capitalize">{{ member.marital_status || 'Not specified' }}</span>
      </div>
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Occupation</p>
        <div class="flex items-center gap-2">
          <Briefcase class="h-4 w-4 text-muted-foreground" />
          <span>{{ member.occupation || 'Not provided' }}</span>
        </div>
      </div>
      <div v-if="member.whatsapp_number" class="space-y-1">
        <p class="text-sm text-muted-foreground">WhatsApp</p>
        <span>{{ member.whatsapp_number }}</span>
      </div>
    </CardContent>
  </Card>
</template>
