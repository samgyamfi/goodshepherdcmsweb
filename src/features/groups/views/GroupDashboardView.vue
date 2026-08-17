<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays, Megaphone, UserCheck, UsersRound } from 'lucide-vue-next'
import RoleDistributionChart from '../components/dashboard/RoleDistributionChart.vue'
import { groupsService } from '../services/groupsService'

const route = useRoute()
const loading = ref(true)
const summary = ref(null)

const cards = computed(() => [
  { label: 'Total members', value: summary.value?.members_total ?? 0, icon: UsersRound },
  { label: 'Active members', value: summary.value?.members_active ?? 0, icon: UserCheck },
  { label: 'Announcements', value: summary.value?.announcements ?? 0, icon: Megaphone },
  { label: 'Upcoming events', value: summary.value?.upcoming_events ?? 0, icon: CalendarDays },
])

onMounted(async () => {
  try {
    const response = await groupsService.dashboard(route.params.uuid)
    summary.value = response.data.data.summary
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="h-80 animate-pulse rounded-md bg-muted" />
  <div v-else class="space-y-6">
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <article v-for="card in cards" :key="card.label" class="rounded-md border p-4 sm:p-5">
        <component :is="card.icon" class="h-5 w-5 text-primary" />
        <p class="mt-5 text-2xl font-bold sm:text-3xl">{{ card.value }}</p>
        <p class="mt-1 text-xs text-muted-foreground sm:text-sm">{{ card.label }}</p>
      </article>
    </div>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <h2 class="text-lg font-semibold">Membership overview</h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Current active membership distribution by responsibility.
        </p>
        <RoleDistributionChart class="mt-4" :distribution="summary.role_distribution" />
      </div>
      <aside class="border-l-0 lg:border-l lg:pl-6">
        <h2 class="text-lg font-semibold">At a glance</h2>
        <div class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between border-b pb-3">
            <span class="text-muted-foreground">Active rate</span>
            <strong>
              {{
                summary.members_total
                  ? Math.round((summary.members_active / summary.members_total) * 100)
                  : 0
              }}%
            </strong>
          </div>
          <div class="flex justify-between border-b pb-3">
            <span class="text-muted-foreground">Published updates</span>
            <strong>{{ summary.announcements }}</strong>
          </div>
          <div class="flex justify-between border-b pb-3">
            <span class="text-muted-foreground">Planned events</span>
            <strong>{{ summary.upcoming_events }}</strong>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
