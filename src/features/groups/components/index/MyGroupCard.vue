<script setup>
import { computed } from 'vue'
import { ArrowRight, CalendarDays, UsersRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNameGradient } from '@/composables/useNameGradient'

const props = defineProps({
  group: { type: Object, required: true },
})

const emit = defineEmits(['open'])
const { gradientFor, initialsFor } = useNameGradient()
const initials = computed(() => initialsFor(props.group.name))
const gradient = computed(() => gradientFor(props.group.name))
</script>

<template>
  <article class="group isolate overflow-hidden rounded-md border bg-card">
    <div class="relative h-28" :style="{ background: gradient }">
      <img
        v-if="group.banner_url"
        :src="group.banner_url"
        :alt="`${group.name} banner`"
        class="h-full w-full object-cover"
      />
      <Badge v-if="group.is_archived" variant="secondary" class="absolute right-3 top-3">
        Archived
      </Badge>
    </div>

    <div class="relative z-10 px-4 pb-4">
      <div class="relative z-10 -mt-8 flex items-end justify-between gap-3">
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border-4 border-card bg-primary text-lg font-bold text-primary-foreground"
        >
          <img
            v-if="group.logo_url"
            :src="group.logo_url"
            :alt="`${group.name} logo`"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>
        <Badge variant="outline" class="mb-1 max-w-[55%] truncate">
          {{ group.membership?.title || group.membership?.member_role_label || 'Member' }}
        </Badge>
      </div>

      <h2 class="relative z-10 mt-3 text-base font-semibold">{{ group.name }}</h2>
      <p class="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
        {{ group.description || 'Your church group workspace.' }}
      </p>

      <div class="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span class="flex items-center gap-1">
          <UsersRound class="h-3.5 w-3.5" /> {{ group.members_count }} members
        </span>
        <span class="flex items-center gap-1">
          <CalendarDays class="h-3.5 w-3.5" /> View schedule
        </span>
      </div>

      <Button class="mt-4 w-full" variant="outline" @click="emit('open', group)">
        Open workspace <ArrowRight class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </article>
</template>
