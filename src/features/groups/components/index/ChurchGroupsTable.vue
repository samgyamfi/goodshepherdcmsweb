<script setup>
import { Archive, ArrowRight, Pencil, RotateCcw, UsersRound } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps({
  groups: { type: Array, default: () => [] },
  canUpdate: { type: Boolean, default: false },
  canArchive: { type: Boolean, default: false },
})

const emit = defineEmits(['open', 'edit', 'archive', 'restore'])
</script>

<template>
  <div class="overflow-hidden rounded-md border">
    <div class="hidden grid-cols-[minmax(220px,1fr)_160px_110px_120px_132px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
      <span>Group</span><span>Category</span><span>Members</span><span>Status</span
      ><span class="text-right">Actions</span>
    </div>

    <div v-if="!groups.length" class="px-5 py-16 text-center text-sm text-muted-foreground">
      No church groups match the current filters.
    </div>

    <article
      v-for="group in groups"
      :key="group.uuid"
      class="grid gap-3 border-b px-4 py-4 last:border-0 md:grid-cols-[minmax(220px,1fr)_160px_110px_120px_132px] md:items-center md:gap-4"
    >
      <div class="min-w-0">
        <p class="truncate font-medium">{{ group.name }}</p>
        <p class="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {{ group.description || 'No description' }}
        </p>
      </div>
      <span class="text-sm text-muted-foreground">{{ group.category?.name || 'Uncategorized' }}</span>
      <span class="flex items-center gap-1.5 text-sm">
        <UsersRound class="h-4 w-4 text-muted-foreground" /> {{ group.members_count }}
      </span>
      <div>
        <Badge v-if="group.is_archived" variant="secondary">Archived</Badge>
        <Badge v-else :variant="group.is_active ? 'default' : 'outline'">
          {{ group.is_active ? 'Active' : 'Inactive' }}
        </Badge>
      </div>
      <div class="flex justify-end gap-1">
        <Button size="icon" variant="ghost" title="Open group" @click="emit('open', group)">
          <ArrowRight class="h-4 w-4" />
        </Button>
        <Button
          v-if="canUpdate && !group.is_archived"
          size="icon"
          variant="ghost"
          title="Edit group"
          @click="emit('edit', group)"
        >
          <Pencil class="h-4 w-4" />
        </Button>
        <Button
          v-if="canArchive && !group.is_archived"
          size="icon"
          variant="ghost"
          title="Archive group"
          @click="emit('archive', group)"
        >
          <Archive class="h-4 w-4" />
        </Button>
        <Button
          v-if="canArchive && group.is_archived"
          size="icon"
          variant="ghost"
          title="Restore group"
          @click="emit('restore', group)"
        >
          <RotateCcw class="h-4 w-4" />
        </Button>
      </div>
    </article>
  </div>
</template>
