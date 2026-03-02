<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Initialize theme on app mount
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <RouterView />
</template>
