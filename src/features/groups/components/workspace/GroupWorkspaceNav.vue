<script setup>
import { useRoute, useRouter } from 'vue-router'
import { workspaceNavigation } from '../../config/workspaceNavigation'

const props = defineProps({
  uuid: { type: String, required: true },
  capabilities: { type: Object, default: () => ({}) },
})

const route = useRoute()
const router = useRouter()

function navigate(name) {
  router.push({ name, params: { uuid: props.uuid } })
}
</script>

<template>
  <nav class="sticky top-16 z-20 -mx-4 overflow-x-auto border-y bg-background px-4 shadow-sm sm:mx-0 sm:px-0">
    <div class="flex min-w-max items-center gap-1 py-2">
      <button
        v-for="item in workspaceNavigation(capabilities)"
        :key="item.name"
        type="button"
        class="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors"
        :class="
          route.name === item.name
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        "
        @click="navigate(item.name)"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </button>
    </div>
  </nav>
</template>
