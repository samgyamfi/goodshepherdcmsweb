<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import { useAuditLogs } from './composables/useAuditLogs'
import AuditSummaryCards from './components/AuditSummaryCards.vue'
import AuditFilters from './components/AuditFilters.vue'
import AuditLogTable from './components/AuditLogTable.vue'
import AuditDetailSheet from './components/AuditDetailSheet.vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import { ScrollText } from 'lucide-vue-next'
import { Download, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth/auth'

const route = useRoute()
const system = computed(() => route.path.startsWith('/admin'))
const { logs, stats, loading, exporting, pagination, filters, applyFilters, clearFilters, setPage, setPerPage, exportLogs } = useAuditLogs(system.value)
const adminStore = useAdminDashboardStore()
const authStore = useAuthStore()
const selectedLog = ref(null)
const detailOpen = ref(false)

if (system.value && !adminStore.churches.length) adminStore.fetchChurches({ perPage: 100 })

function view(log) { selectedLog.value = log; detailOpen.value = true }
</script>

<template>
  <component :is="system ? 'div' : DashboardLayout">
    <div class="space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-md bg-sky-500/10"><ScrollText class="h-5 w-5 text-sky-600" /></div><div><h1 class="text-xl font-bold">Audit Logs</h1><p class="text-sm text-muted-foreground">{{ system ? 'Review activity across the platform and every church.' : 'Review activity recorded for this church.' }}</p></div></div>
        <Button v-if="authStore.can('audit.export')" :disabled="exporting" @click="exportLogs">
          <Loader2 v-if="exporting" class="mr-2 h-4 w-4 animate-spin" />
          <Download v-else class="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <AuditSummaryCards :stats="stats" :system="system" />
      <AuditFilters :filters="filters" :system="system" :churches="adminStore.churches" @apply="applyFilters" @clear="clearFilters" />
      <AuditLogTable :logs="logs" :loading="loading" :pagination="pagination" :system="system" @view="view" @page-change="setPage" @per-page-change="setPerPage" />
      <AuditDetailSheet v-model:open="detailOpen" :log="selectedLog" />
    </div>
  </component>
</template>
