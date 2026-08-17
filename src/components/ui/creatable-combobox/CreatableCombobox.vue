<script setup>
import { computed, ref, watch } from 'vue'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select value' },
  searchPlaceholder: { type: String, default: 'Search...' },
  emptyLabel: { type: String, default: 'No matches found' },
  allowCreate: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  class: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const search = ref('')

const normalizedOptions = computed(() =>
  props.options
    .map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return { value: String(option), label: String(option) }
      }

      return {
        value: String(option.value ?? option.id ?? option.name ?? ''),
        label: String(option.label ?? option.name ?? option.value ?? ''),
      }
    })
    .filter((option) => option.value && option.label),
)

const selectedLabel = computed(() => {
  const value = String(props.modelValue ?? '')

  return normalizedOptions.value.find((option) => option.value === value)?.label || value
})

const filteredOptions = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return normalizedOptions.value

  return normalizedOptions.value.filter((option) => option.label.toLowerCase().includes(term))
})

const canCreateSearch = computed(() => {
  const term = search.value.trim()

  if (!props.allowCreate || !term) return false

  return !normalizedOptions.value.some(
    (option) => option.label.toLowerCase() === term.toLowerCase(),
  )
})

watch(
  () => props.modelValue,
  (value) => {
    search.value = selectedLabel.value || String(value ?? '')
  },
  { immediate: true },
)

function selectValue(value) {
  emit('update:modelValue', value)
  open.value = false
}

function createSearchValue() {
  const term = search.value.trim()

  if (term) {
    selectValue(term)
  }
}

function clearValue(event) {
  event.stopPropagation()
  emit('update:modelValue', '')
  search.value = ''
}
</script>

<template>
  <div :class="cn('flex w-full gap-2', props.class)">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          :id="id"
          type="button"
          variant="outline"
          :disabled="disabled"
          :class="cn('min-w-0 flex-1 justify-between text-left font-normal', !modelValue && 'text-muted-foreground')"
        >
          <span class="truncate">{{ selectedLabel || placeholder }}</span>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

    <PopoverContent class="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0" align="start">
      <div class="border-b p-2">
        <Input
          v-model="search"
          class="h-9"
          :placeholder="searchPlaceholder"
          @keydown.enter.prevent="createSearchValue"
        />
      </div>

      <div class="max-h-64 overflow-y-auto p-1">
        <button
          v-for="option in filteredOptions"
          :key="option.value"
          type="button"
          class="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm hover:bg-accent"
          @click="selectValue(option.value)"
        >
          <span class="truncate">{{ option.label }}</span>
          <Check v-if="String(modelValue) === option.value" class="ml-2 h-4 w-4 shrink-0" />
        </button>

        <button
          v-if="canCreateSearch"
          type="button"
          class="flex w-full items-center rounded-sm px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          @click="createSearchValue"
        >
          Use "{{ search.trim() }}"
        </button>

        <div
          v-if="filteredOptions.length === 0 && !canCreateSearch"
          class="px-2 py-6 text-center text-sm text-muted-foreground"
        >
          {{ emptyLabel }}
        </div>
      </div>
      </PopoverContent>
    </Popover>
    <Button
      v-if="modelValue"
      type="button"
      size="icon"
      variant="outline"
      :disabled="disabled"
      title="Clear value"
      @click="clearValue"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Clear value</span>
    </Button>
  </div>
</template>
