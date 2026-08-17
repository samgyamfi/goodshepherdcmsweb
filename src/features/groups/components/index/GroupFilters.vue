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

defineProps({
  search: { type: String, default: '' },
  filters: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  showArchive: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'filter'])
</script>

<template>
  <div class="flex flex-col gap-3 border-y py-4 lg:flex-row lg:items-center">
    <div class="relative min-w-0 flex-1 lg:max-w-md">
      <Search
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        :model-value="search"
        class="pl-9"
        placeholder="Search groups by name or description"
        @update:model-value="emit('search', $event)"
      />
    </div>

    <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Select
        :model-value="String(filters.category_id)"
        @update:model-value="emit('filter', 'category_id', $event)"
      >
        <SelectTrigger class="min-w-0 sm:w-44">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem v-for="category in categories" :key="category.id" :value="String(category.id)">
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="filters.template"
        @update:model-value="emit('filter', 'template', $event)"
      >
        <SelectTrigger class="min-w-0 sm:w-40">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          <SelectItem value="template">From template</SelectItem>
          <SelectItem value="custom">Custom groups</SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="String(filters.is_active)"
        @update:model-value="emit('filter', 'is_active', $event)"
      >
        <SelectTrigger class="min-w-0 sm:w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="1">Active</SelectItem>
          <SelectItem value="0">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        v-if="showArchive"
        :model-value="filters.archived"
        @update:model-value="emit('filter', 'archived', $event)"
      >
        <SelectTrigger class="col-span-2 min-w-0 sm:w-40">
          <SlidersHorizontal class="mr-2 h-4 w-4" />
          <SelectValue placeholder="Archive" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="without">Current groups</SelectItem>
          <SelectItem value="only">Archived only</SelectItem>
          <SelectItem value="with">All groups</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
