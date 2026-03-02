<script setup>
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  rows: {
    type: Number,
    default: 5,
  },
})
</script>

<template>
  <div class="space-y-4">
    <div v-for="i in rows" :key="i" class="flex items-center gap-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="flex-1 space-y-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    </div>
  </div>
</template>
