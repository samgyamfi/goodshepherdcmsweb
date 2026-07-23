<script setup>
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { Eye, Headphones } from 'lucide-vue-next'

defineProps({
  logs: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, required: true },
  system: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})
const emit = defineEmits(['view', 'page-change', 'per-page-change'])

function statusVariant(status) {
  return status >= 400 ? 'destructive' : 'outline'
}
function formatTime(value) {
  return value ? new Date(value).toLocaleString() : '-'
}
</script>

<template>
  <div>
    <div class="border bg-card">
      <Table>
        <TableHeader
          ><TableRow
            ><TableHead>Time</TableHead><TableHead>Actor</TableHead
            ><TableHead v-if="system">Church</TableHead><TableHead>Activity</TableHead
            ><TableHead>Outcome</TableHead><TableHead class="w-14" /></TableRow
        ></TableHeader>
        <TableBody>
          <template v-if="loading"
            ><TableRow v-for="index in 5" :key="index"
              ><TableCell v-for="cell in system ? 6 : 5" :key="cell"
                ><Skeleton class="h-4 w-full" /></TableCell></TableRow
          ></template>
          <TableRow v-else-if="!logs.length"
            ><TableCell :colspan="system ? 6 : 5" class="h-28 text-center text-muted-foreground"
              >No audit activity matches these filters.</TableCell
            ></TableRow
          >
          <TableRow v-for="log in logs" v-else :key="log.uuid">
            <TableCell class="whitespace-nowrap text-xs text-muted-foreground">{{
              formatTime(log.created_at)
            }}</TableCell>
            <TableCell
              ><p class="text-sm font-medium">{{ log.actor?.name || 'System' }}</p>
              <p class="text-xs text-muted-foreground">{{ log.actor?.email }}</p></TableCell
            >
            <TableCell v-if="system" class="text-sm">{{
              log.church?.name || 'Platform'
            }}</TableCell>
            <TableCell
              ><div class="flex items-start gap-2">
                <Headphones
                  v-if="log.is_support_access"
                  class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600"
                />
                <div>
                  <p class="max-w-xl text-sm">{{ log.description }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ log.category?.replaceAll('_', ' ') }} &middot; {{ log.http_method }}
                  </p>
                </div>
              </div></TableCell
            >
            <TableCell
              ><Badge :variant="statusVariant(log.response_status)">{{
                log.response_status
              }}</Badge></TableCell
            >
            <TableCell
              ><Button
                variant="ghost"
                size="icon"
                title="View audit details"
                @click="emit('view', log)"
                ><Eye class="h-4 w-4" /></Button
            ></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="mt-3 mb-6">
      <TablePagination
        v-if="!compact"
        :current-page="pagination.currentPage"
        :last-page="pagination.lastPage"
        :per-page="pagination.perPage"
        :total="pagination.total"
        :from="pagination.from"
        :to="pagination.to"
        @page-change="emit('page-change', $event)"
        @per-page-change="emit('per-page-change', $event)"
      />
    </div>
  </div>
</template>
