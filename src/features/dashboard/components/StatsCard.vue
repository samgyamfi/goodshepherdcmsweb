<script setup>
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
  iconColor: {
    type: String,
    default: 'text-primary',
  },
  bgColor: {
    type: String,
    default: 'bg-muted',
  },
  badge: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-3xl font-bold text-foreground">{{ value }}</p>
            <Badge v-if="badge" variant="secondary" class="text-xs">
              {{ badge }}
            </Badge>
          </div>
        </div>
        <div :class="['rounded-full p-3', bgColor]">
          <component :is="icon" :class="['h-6 w-6', iconColor]" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
