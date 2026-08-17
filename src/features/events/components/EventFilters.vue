<script setup>
import { Search, SlidersHorizontal } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'

const props = defineProps({
  modelValue: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value === 'all' ? '' : value })
}
</script>

<template>
  <div class="grid gap-3 border-y py-4 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1.6fr)_repeat(5,minmax(140px,1fr))]">
    <label class="relative">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        :model-value="modelValue.search"
        class="pl-9"
        placeholder="Search events"
        @update:model-value="update('search', $event)"
      />
    </label>
    <Select :model-value="modelValue.period || 'all'" @update:model-value="update('period', $event)">
      <SelectTrigger><SlidersHorizontal class="mr-2 h-4 w-4" /><SelectValue placeholder="Time period" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All events</SelectItem>
        <SelectItem value="upcoming">Upcoming</SelectItem>
        <SelectItem value="past">Past</SelectItem>
      </SelectContent>
    </Select>
    <Select :model-value="String(modelValue.category_id || 'all')" @update:model-value="update('category_id', $event)">
      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        <SelectItem v-for="category in categories" :key="category.uuid" :value="String(category.id)">{{ category.name }}</SelectItem>
      </SelectContent>
    </Select>
    <Select :model-value="modelValue.status || 'all'" @update:model-value="update('status', $event)">
      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem v-for="status in statuses" :key="status.value" :value="status.value">{{ status.name }}</SelectItem>
      </SelectContent>
    </Select>
    <DatePicker :model-value="modelValue.date_from" placeholder="From date" @update:model-value="update('date_from', $event)" />
    <DatePicker :model-value="modelValue.date_to" placeholder="To date" @update:model-value="update('date_to', $event)" />
  </div>
</template>
