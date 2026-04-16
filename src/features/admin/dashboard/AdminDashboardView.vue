<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  Users,
  UserCheck,
  Activity,
  ShieldCheck,
  ArrowLeftRight,
  Settings,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()
const adminStore = useAdminDashboardStore()
const statsLoaded = ref(false)

const stats = ref([
  {
    label: 'Total Churches',
    key: 'total_churches',
    icon: Building2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    route: 'admin-churches',
  },
  {
    label: 'Active Churches',
    key: 'active_churches',
    icon: Activity,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    route: 'admin-churches',
  },
  {
    label: 'Total Users',
    key: 'total_users',
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    route: 'admin-users',
  },
  {
    label: 'Active Members',
    key: 'total_members',
    icon: UserCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    route: null,
  },
  {
    label: 'New Transfer Requests',
    key: 'new_transfer_requests',
    icon: ArrowLeftRight,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    route: 'admin-transfers',
  },
])

const navigationSections = ref([
  {
    icon: Building2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Churches',
    desc: 'View, activate and manage all churches',
    route: 'admin-churches',
  },
  {
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    title: 'Users',
    desc: 'Browse and manage all platform users',
    route: 'admin-users',
  },
  {
    icon: ArrowLeftRight,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    title: 'Transfer Requests',
    desc: 'Review church transfer requests',
    route: 'admin-transfers',
  },
  {
    icon: ShieldCheck,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    title: 'Roles & Permissions',
    desc: 'Configure access control for user roles',
    route: 'admin-roles',
  },
  {
    icon: Settings,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    title: 'System Settings',
    desc: 'Global platform configuration',
    route: 'admin-settings',
  },
])

onMounted(async () => {
  await adminStore.fetchStats()
  statsLoaded.value = true
})
</script>

<template>
  <div class="space-y-8">
    <!-- ── Page Header ───────────────────────────────────────────── -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
        <ShieldCheck class="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-foreground">System Overview</h1>
        <p class="text-sm text-muted-foreground">Platform-wide statistics at a glance</p>
      </div>
    </div>

    <!-- ── Stats Cards ───────────────────────────────────────────── -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="stat in stats"
        :key="stat.key"
        class="cursor-pointer transition-shadow hover:shadow-md"
        @click="stat.route && router.push({ name: stat.route })"
      >
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ stat.label }}</CardTitle>
          <div class="rounded-md p-1.5" :class="stat.bg">
            <component :is="stat.icon" class="h-4 w-4" :class="stat.color" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="!statsLoaded" class="h-8 w-20" />
          <div v-else class="text-2xl font-bold tabular-nums">
            {{ (adminStore.stats?.[stat.key] ?? 0).toLocaleString() }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ── Quick Navigation ──────────────────────────────────────── -->
    <div>
      <h2 class="text-base font-semibold text-foreground mb-3">Manage Platform</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="section in navigationSections"
          :key="section.title"
          class="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 group"
          @click="router.push({ name: section.route })"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="rounded-lg p-2 shrink-0" :class="section.bg">
                <component :is="section.icon" class="h-5 w-5" :class="section.color" />
              </div>
              <ChevronRight
                class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              />
            </div>
            <CardTitle class="text-sm font-semibold mt-2">{{ section.title }}</CardTitle>
            <CardDescription class="text-xs">{{ section.desc }}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </div>
</template>
