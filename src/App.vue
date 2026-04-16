<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import PageProgress from '@/components/ui/progress/PageProgress.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <PageProgress />
  <RouterView />
  <ConfirmDialog />
</template>
