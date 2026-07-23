<script setup>
import { Activity, AlertTriangle, Headphones, PenLine, Users } from 'lucide-vue-next'

defineProps({ stats: { type: Object, default: () => ({}) }, system: { type: Boolean, default: false } })
const cards = [
  { key: 'total', label: 'Total Activity', icon: Activity, tone: 'text-blue-600 bg-blue-500/10' },
  { key: 'mutations', label: 'Changes Made', icon: PenLine, tone: 'text-emerald-600 bg-emerald-500/10' },
  { key: 'failures', label: 'Failed Requests', icon: AlertTriangle, tone: 'text-rose-600 bg-rose-500/10' },
]
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="card in cards" :key="card.key" class="flex items-center gap-3 border bg-card p-4">
      <div class="flex h-9 w-9 items-center justify-center rounded-md" :class="card.tone"><component :is="card.icon" class="h-4 w-4" /></div>
      <div><p class="text-xs text-muted-foreground">{{ card.label }}</p><p class="text-xl font-semibold tabular-nums">{{ (stats[card.key] || 0).toLocaleString() }}</p></div>
    </div>
    <div class="flex items-center gap-3 border bg-card p-4">
      <div class="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10 text-amber-600"><component :is="system ? Headphones : Users" class="h-4 w-4" /></div>
      <div><p class="text-xs text-muted-foreground">{{ system ? 'Support Activity' : 'Unique Actors' }}</p><p class="text-xl font-semibold tabular-nums">{{ (stats[system ? 'support_activity' : 'unique_actors'] || 0).toLocaleString() }}</p></div>
    </div>
  </div>
</template>
