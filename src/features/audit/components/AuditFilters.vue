<script setup>
import { reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'

const props = defineProps({
  filters: { type: Object, required: true },
  system: { type: Boolean, default: false },
  churches: { type: Array, default: () => [] },
})
const emit = defineEmits(['apply', 'clear'])
const draft = reactive({ ...props.filters })

watch(
  () => props.filters,
  (filters) => Object.assign(draft, filters),
  { deep: true },
)
</script>

<template>
  <div class="border bg-card p-4">
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div class="relative xl:col-span-2">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="draft.search"
          placeholder="Search action, route, or actor"
          class="pl-9"
          @keyup.enter="emit('apply', { ...draft })"
        />
      </div>
      <select
        v-if="system"
        v-model="draft.church_uuid"
        class="h-10 border bg-background px-3 text-sm"
      >
        <option value="">All churches</option>
        <option v-for="church in churches" :key="church.uuid" :value="church.uuid">
          {{ church.name }}
        </option>
      </select>
      <select v-model="draft.category" class="h-10 border bg-background px-3 text-sm">
        <option value="">All categories</option>
        <option value="authentication">Authentication</option>
        <option value="support_access">Support access</option>
        <option value="member_management">Members</option>
        <option value="finance">Finance</option>
        <option value="church_content">Church content</option>
        <option value="administration">Administration</option>
        <option value="system">System</option>
      </select>
      <select v-model="draft.method" class="h-10 border bg-background px-3 text-sm">
        <option value="">All methods</option>
        <option v-for="method in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']" :key="method">
          {{ method }}
        </option>
      </select>
      <select v-model="draft.outcome" class="h-10 border bg-background px-3 text-sm">
        <option value="">Any outcome</option>
        <option value="success">Successful</option>
        <option value="failed">Failed</option>
      </select>
      <DatePicker v-model="draft.date_from" placeholder="From date" />
      <DatePicker v-model="draft.date_to" placeholder="To date" />
      <label v-if="system" class="flex h-10 items-center gap-2 border px-3 text-sm">
        <Checkbox v-model="draft.support_only" /> Support sessions only
      </label>
    </div>
    <div class="mt-3 flex justify-end gap-2">
      <Button variant="ghost" @click="emit('clear')"><X class="mr-2 h-4 w-4" />Clear</Button>
      <Button @click="emit('apply', { ...draft })"
        ><SlidersHorizontal class="mr-2 h-4 w-4" />Apply filters</Button
      >
    </div>
  </div>
</template>
