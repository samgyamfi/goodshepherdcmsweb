<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useChurchStore } from '@/stores/church'

const props = defineProps({
  logo: { type: String, default: null },
  name: { type: String, default: null },
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
  showText: { type: Boolean, default: true },
})

const churchStore = useChurchStore()

// Priority chain: explicit prop → church store → env var → hardcoded default
const resolvedName = computed(
  () =>
    props.name ??
    churchStore.church?.name ??
    import.meta.env.VITE_APP_NAME ??
    'Assemblies of God Ghana',
)

const resolvedLogo = computed(
  () => props.logo ?? churchStore.church?.logo_url ?? import.meta.env.VITE_APP_LOGO ?? null,
)

const sizeClasses = { sm: 'h-8', md: 'h-10', lg: 'h-12' }
const textSizeClasses = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="flex items-center gap-3 transition-opacity hover:opacity-80">
    <img
      v-if="resolvedLogo"
      :src="resolvedLogo"
      :alt="resolvedName"
      :class="sizeClasses[size]"
      class="w-auto object-contain"
    />
    <div
      v-else
      :class="sizeClasses[size]"
      class="aspect-square rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
    >
      {{ resolvedName.charAt(0).toUpperCase() }}
    </div>
    <span
      v-if="showText"
      :class="[
        textSizeClasses[size],
        variant === 'light' ? 'text-white' : 'text-slate-900',
      ]"
      class="font-semibold"
    >
      {{ resolvedName }}
    </span>
  </RouterLink>
</template>
