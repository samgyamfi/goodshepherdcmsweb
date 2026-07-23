<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const props = defineProps({
  open: { type: Boolean, default: false },
  log: { type: Object, default: null },
})
const emit = defineEmits(['update:open'])
const metadata = computed(() => JSON.stringify(props.log?.metadata || {}, null, 2))
const changes = computed(() =>
  JSON.stringify({ before: props.log?.old_values, after: props.log?.new_values }, null, 2),
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="w-[95vw] overflow-y-auto sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    >
      <SheetHeader
        ><SheetTitle>Audit details</SheetTitle
        ><SheetDescription>{{ log?.description }}</SheetDescription></SheetHeader
      >
      <div v-if="log" class="mt-6 space-y-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-muted-foreground">Actor</p>
            <p class="font-medium">{{ log.actor?.name || 'System' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Church</p>
            <p class="font-medium">{{ log.church?.name || 'Platform' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Request</p>
            <p class="font-mono text-xs">{{ log.http_method }} · {{ log.route_name }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Outcome</p>
            <Badge :variant="log.response_status >= 400 ? 'destructive' : 'outline'">{{
              log.response_status
            }}</Badge>
          </div>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Affected resource</p>
          <div class="border bg-muted/30 p-3 font-mono text-xs">
            {{ log.resource?.type }} #{{ log.resource?.id || '-' }}
          </div>
        </div>
        <div v-if="log.old_values || log.new_values">
          <p class="mb-2 text-sm font-medium">Changes</p>
          <pre class="max-h-72 overflow-auto border bg-muted/30 p-3 text-xs">{{ changes }}</pre>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Request metadata</p>
          <pre class="max-h-80 overflow-auto border bg-muted/30 p-3 text-xs">{{ metadata }}</pre>
        </div>
        <div class="text-xs text-muted-foreground">
          <p>Request ID: {{ log.request_uuid }}</p>
          <p>IP: {{ log.ip_address || '-' }}</p>
          <p>{{ new Date(log.created_at).toLocaleString() }}</p>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
