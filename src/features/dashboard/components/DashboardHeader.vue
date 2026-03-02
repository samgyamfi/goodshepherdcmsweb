<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

import { Menu } from 'lucide-vue-next'

defineEmits(['toggle-mobile-menu'])

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const crumbs = []
  const pathSegments = route.path.split('/').filter((segment) => segment)

  pathSegments.forEach((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    // Find the route match for this specific path
    const matchedRoute = router.resolve(path).matched.slice(-1)[0]
    const breadcrumbName = matchedRoute?.meta?.breadcrumb || name

    crumbs.push({
      name: breadcrumbName,
      path,
      isLast: index === pathSegments.length - 1,
    })
  })

  return crumbs
})
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
  >
    <!-- Mobile Menu Toggle -->
    <Button variant="ghost" size="icon" class="md:hidden" @click="$emit('toggle-mobile-menu')">
      <Menu class="h-5 w-5" />
    </Button>

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-sm">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <a
          v-if="!crumb.isLast"
          :href="crumb.path"
          class="text-muted-foreground hover:text-foreground transition-colors"
          @click.prevent="router.push(crumb.path)"
        >
          {{ crumb.name }}
        </a>
        <span v-else class="font-medium text-foreground">
          {{ crumb.name }}
        </span>
        <span v-if="index < breadcrumbs.length - 1" class="text-muted-foreground">/</span>
      </template>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />
  </header>
</template>
