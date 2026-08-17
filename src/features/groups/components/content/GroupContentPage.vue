<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import GroupContentSheet from './GroupContentSheet.vue'
import { useGroupContent } from '../../composables/useGroupContent'
import { groupsService } from '../../services/groupsService'
import { showToast } from '@/utils/toast'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps({
  groupUuid: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  canManage: { type: Boolean, default: false },
})

const sheetOpen = ref(false)
const selected = ref(null)
const members = ref([])
const { confirm } = useConfirm()
const { items, loading, meta, load, save, remove } = useGroupContent(props.groupUuid, props.type)
const labels = {
  announcements: 'announcement',
  schedules: 'meeting schedule',
  minutes: 'meeting minutes',
  notices: 'direct notice',
}

function create() {
  selected.value = null
  sheetOpen.value = true
}

function edit(item) {
  selected.value = item
  sheetOpen.value = true
}

async function submit(payload) {
  await save(payload, selected.value?.uuid)
  sheetOpen.value = false
  showToast.success(`${props.title} saved.`)
}

async function destroy(item) {
  const itemName = item.title || item.name || item.subject
  const confirmed = await confirm({
    title: `Delete ${itemName}?`,
    description: `This ${labels[props.type]} will be removed from the group and cannot be restored from the app.`,
    confirmLabel: 'Delete',
  })
  if (!confirmed) return

  await remove(item.uuid)
  showToast.success('Item deleted.')
}

async function loadMembers() {
  if (props.type !== 'notices' || !props.canManage) return
  const response = await groupsService.members(props.groupUuid, { perPage: 100 })
  members.value = response.data.data.memberships ?? []
}

onMounted(() => {
  load()
  loadMembers()
})
</script>

<template>
  <section class="space-y-4">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <p class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <Button v-if="canManage" @click="create"><Plus class="mr-2 h-4 w-4" /> Add new</Button>
    </header>

    <div v-if="loading" class="h-72 animate-pulse rounded-md bg-muted" />
    <div v-else class="divide-y border-y">
      <article v-for="item in items" :key="item.uuid" class="py-5">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-medium">{{ item.title || item.name || item.subject }}</h3>
              <Badge v-if="item.is_pinned" variant="outline">Pinned</Badge>
              <Badge v-if="item.priority && item.priority !== 'normal'" variant="secondary">
                {{ item.priority }}
              </Badge>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">
              {{
                item.meeting_date_label ||
                item.starts_on_label ||
                item.published_at_label ||
                item.sent_at_label
              }}
            </p>
            <div v-if="item.body" class="prose prose-sm mt-3 max-w-none line-clamp-3 dark:prose-invert" v-html="item.body" />
            <p v-if="item.recurrence_type" class="mt-2 text-sm text-muted-foreground">
              {{ item.day_of_week_label }} · {{ item.recurrence_type }} · {{ item.starts_at_label
              }}<span v-if="item.location"> · {{ item.location }}</span>
            </p>
          </div>
          <div v-if="canManage" class="flex shrink-0 gap-1">
            <Button size="sm" variant="outline" @click="edit(item)">Edit</Button>
            <Button size="icon" variant="ghost" title="Delete" @click="destroy(item)">
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
      <p v-if="!items.length" class="py-14 text-center text-sm text-muted-foreground">
        No {{ title.toLowerCase() }} have been added.
      </p>
    </div>

    <TablePagination
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :per-page="meta.per_page"
      :total="meta.total"
      :from="meta.from || 0"
      :to="meta.to || 0"
      @page-change="load($event, meta.per_page)"
      @per-page-change="load(1, $event)"
    />

    <GroupContentSheet
      v-model:open="sheetOpen"
      :type="type"
      :item="selected"
      :members="members"
      @save="submit"
    />
  </section>
</template>
