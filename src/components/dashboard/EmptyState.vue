<script setup>
defineProps({
  title: {
    type: String,
    default: 'No Data',
  },
  description: {
    type: String,
    default: 'There are no items to display.',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div v-if="icon" class="mb-4 rounded-full bg-muted p-4">
      <component :is="icon" class="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>
    <p class="text-sm text-muted-foreground max-w-md">{{ description }}</p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
