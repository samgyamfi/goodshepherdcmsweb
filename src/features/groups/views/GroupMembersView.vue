<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, Trash2, UsersRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import BulkGroupMembersSheet from '../components/members/BulkGroupMembersSheet.vue'
import { groupsService } from '../services/groupsService'
import { showToast } from '@/utils/toast'
import { useConfirm } from '@/composables/useConfirm'

const route = useRoute()
const members = ref([])
const loading = ref(true)
const sheetOpen = ref(false)
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
const { confirm } = useConfirm()

async function load(page = meta.value.current_page, perPage = meta.value.per_page) {
  loading.value = true
  try {
    const response = await groupsService.members(route.params.uuid, { page, perPage })
    members.value = response.data.data.memberships ?? []
    meta.value = response.data.data.meta
  } finally {
    loading.value = false
  }
}

async function remove(member) {
  const memberName = [member.profile?.user?.first_name, member.profile?.user?.last_name]
    .filter(Boolean)
    .join(' ')
  const confirmed = await confirm({
    title: `Remove ${memberName || 'this member'}?`,
    description:
      'The member will lose access to this group and its member-only content. Their membership history will be retained, and they can be added again later.',
    confirmLabel: 'Remove member',
  })
  if (!confirmed) return

  await groupsService.removeMember(route.params.uuid, member.uuid)
  showToast.success('Member removed from the group.')
  load()
}

onMounted(() => load())
</script>

<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Group members</h2>
        <p class="text-sm text-muted-foreground">Roles, titles, and active memberships.</p>
      </div>
      <Button @click="sheetOpen = true"><Plus class="mr-2 h-4 w-4" /> Add members</Button>
    </header>

    <div v-if="loading" class="h-72 animate-pulse rounded-md bg-muted" />
    <div v-else class="overflow-hidden rounded-md border">
      <article
        v-for="member in members"
        :key="member.uuid"
        class="grid gap-3 border-b px-4 py-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_180px_110px_40px] sm:items-center"
      >
        <div class="min-w-0">
          <p class="truncate font-medium">
            {{ member.profile?.user?.first_name }} {{ member.profile?.user?.last_name }}
          </p>
          <p class="truncate text-xs text-muted-foreground">
            {{ member.profile?.user?.email || member.profile?.user?.phone }}
          </p>
        </div>
        <div>
          <p class="text-sm">{{ member.title || member.member_role_label }}</p>
          <p v-if="member.title" class="text-xs text-muted-foreground">
            {{ member.member_role_label }}
          </p>
        </div>
        <Badge variant="outline" class="w-fit">{{ member.status }}</Badge>
        <Button size="icon" variant="ghost" title="Remove member" @click="remove(member)">
          <Trash2 class="h-4 w-4" />
        </Button>
      </article>
      <div v-if="!members.length" class="px-5 py-14 text-center text-sm text-muted-foreground">
        <UsersRound class="mx-auto mb-3 h-9 w-9" /> No group members found.
      </div>
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

    <BulkGroupMembersSheet
      v-model:open="sheetOpen"
      :group-uuid="route.params.uuid"
      @saved="load()"
    />
  </section>
</template>
