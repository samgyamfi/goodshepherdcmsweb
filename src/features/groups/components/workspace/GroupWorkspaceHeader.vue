<script setup>
import { computed } from 'vue'
import { Archive, ChevronLeft } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNameGradient } from '@/composables/useNameGradient'

const props = defineProps({
  group: { type: Object, required: true },
})

const emit = defineEmits(['back'])
const { gradientFor, initialsFor } = useNameGradient()
const initials = computed(() => initialsFor(props.group.name))
const gradient = computed(() => gradientFor(props.group.name))
</script>

<template>
  <header class="flex min-w-0 items-center gap-3">
    <Button size="icon" variant="ghost" title="Back to groups" @click="emit('back')">
      <ChevronLeft class="h-5 w-5" />
    </Button>
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md font-bold text-white"
      :style="{ background: gradient }"
    >
      <img
        v-if="group.logo_url"
        :src="group.logo_url"
        :alt="`${group.name} logo`"
        class="h-full w-full object-cover"
      />
      <span v-else>{{ initials }}</span>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <h1 class="truncate text-lg font-semibold sm:text-xl">{{ group.name }}</h1>
        <Badge v-if="group.is_archived" variant="secondary">
          <Archive class="mr-1 h-3 w-3" /> Archived
        </Badge>
      </div>
      <p class="truncate text-xs text-muted-foreground sm:text-sm">
        {{ group.category?.name || 'Church group' }}
      </p>
    </div>
  </header>
</template>
