<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auditService } from '@/services/audit/auditService'
import { Button } from '@/components/ui/button'
import { ArrowRight, Headphones } from 'lucide-vue-next'

const props = defineProps({ system: { type: Boolean, default: false } })
const router = useRouter()
const logs = ref([])

onMounted(async () => {
  const response = await auditService.summary({}, props.system)
  logs.value = (response.data.recent || []).slice(0, 15)
})

function viewAll() {
  router.push({ name: props.system ? 'admin-audit-logs' : 'church-audit-logs' })
}
</script>

<template>
  <section class="border bg-card">
    <div class="flex items-center justify-between border-b px-4 py-3"><div><h2 class="text-sm font-semibold">Recent audit activity</h2><p class="text-xs text-muted-foreground">Latest recorded actions</p></div><Button variant="ghost" size="sm" @click="viewAll">View all <ArrowRight class="ml-2 h-4 w-4" /></Button></div>
    <div class="divide-y">
      <div v-if="!logs.length" class="px-4 py-8 text-center text-sm text-muted-foreground">No activity has been recorded.</div>
      <div v-for="log in logs" :key="log.uuid" class="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[150px_1fr_120px] sm:items-center">
        <div><p class="font-medium">{{ log.actor?.name || 'System' }}</p><p class="text-xs text-muted-foreground">{{ new Date(log.created_at).toLocaleString() }}</p></div>
        <p class="flex min-w-0 items-center gap-2 truncate"><Headphones v-if="log.is_support_access" class="h-3.5 w-3.5 shrink-0 text-amber-600" />{{ log.description }}</p>
        <p class="truncate text-xs text-muted-foreground">{{ props.system ? (log.church?.name || 'Platform') : log.category?.replaceAll('_', ' ') }}</p>
      </div>
    </div>
  </section>
</template>
