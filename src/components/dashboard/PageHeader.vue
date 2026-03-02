<script setup>
import { Card, CardContent } from '@/components/ui/card'

defineProps({
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconClass: {
    type: String,
    default: 'text-muted-foreground',
  },
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="title || description || icon" class="flex items-center gap-4">
      <div v-if="icon" :class="['rounded-lg p-3 bg-primary/10', iconClass]">
        <component :is="icon" class="h-8 w-8" />
      </div>
      <div class="flex-1">
        <h2 v-if="title" class="text-2xl font-bold text-foreground">{{ title }}</h2>
        <p v-if="description" class="text-muted-foreground mt-1">{{ description }}</p>
      </div>
      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
    
    <Card>
      <CardContent class="p-6">
        <slot />
      </CardContent>
    </Card>
  </div>
</template>
