<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, UserRound } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { groupsService } from '../services/groupsService'

const route = useRoute()
const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  try {
    const response = await groupsService.personal(route.params.uuid)
    data.value = response.data.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="h-72 animate-pulse rounded-md bg-muted" />
  <div v-else-if="data" class="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
    <aside class="rounded-md border p-5">
      <UserRound class="h-6 w-6 text-primary" />
      <p class="mt-5 text-xs font-medium uppercase text-muted-foreground">Your position</p>
      <h2 class="mt-1 text-xl font-semibold">
        {{ data.membership.title || data.membership.member_role_label }}
      </h2>
      <Badge class="mt-3" variant="outline">{{ data.membership.status }}</Badge>
      <p class="mt-5 text-sm text-muted-foreground">
        Member since {{ data.membership.joined_at?.slice(0, 10) }}
      </p>
    </aside>

    <section>
      <div class="flex items-center gap-2">
        <Bell class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-semibold">Direct notices</h2>
      </div>
      <div class="mt-4 divide-y border-y">
        <article v-for="notice in data.notices" :key="notice.uuid" class="py-4">
          <div class="flex items-start justify-between gap-3">
            <p class="font-medium">{{ notice.subject }}</p>
            <Badge :variant="notice.is_read ? 'outline' : 'default'">
              {{ notice.is_read ? 'Read' : 'New' }}
            </Badge>
          </div>
          <div class="prose prose-sm mt-2 max-w-none dark:prose-invert" v-html="notice.body" />
        </article>
        <p v-if="!data.notices.length" class="py-10 text-sm text-muted-foreground">
          You have no direct group notices.
        </p>
      </div>
    </section>
  </div>
</template>
