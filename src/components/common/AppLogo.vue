<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useChurchStore } from '@/stores/church'

const churchStore = useChurchStore()
const churchData = ref(churchStore.church)

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['light', 'dark'].includes(value),
  },
  showText: {
    type: Boolean,
    default: true,
  },
})

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
}

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
}
</script>

<template>
  <RouterLink
    :to="{ name: 'home' }"
    class="flex items-center gap-3 transition-opacity hover:opacity-80"
  >
    <img
      src="/ag-logo.png"
      :alt="churchData.name"
      :class="sizeClasses[props.size]"
      class="w-auto"
    />
    <span
      v-if="props.showText"
      :class="[
        textSizeClasses[props.size],
        props.variant === 'light' ? 'text-white' : 'text-slate-900',
      ]"
      class="font-semibold"
    >
      {{ churchData.name }}
    </span>
  </RouterLink>
</template>
