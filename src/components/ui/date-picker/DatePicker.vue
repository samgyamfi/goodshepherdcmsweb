<script setup>
import { computed, ref } from 'vue'
import { CalendarIcon, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: { type: [String, Date], default: '' },
  placeholder: { type: String, default: 'Select date' },
  disabled: { type: Boolean, default: false },
  min: { type: [String, Date], default: undefined },
  max: { type: [String, Date], default: undefined },
  id: { type: String, default: undefined },
  class: { type: String, default: undefined },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])
const open = ref(false)

function parseDate(value) {
  if (!value) return undefined
  if (value instanceof Date) return value

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return undefined

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function formatValue(value) {
  const date = parseDate(value)
  if (!date || Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function serializeDate(date) {
  if (!date) return ''
  const normalizedDate = date instanceof Date ? date : new Date(date.year, date.month - 1, date.day)

  if (Number.isNaN(normalizedDate.getTime())) return ''

  const year = normalizedDate.getFullYear()
  const month = String(normalizedDate.getMonth() + 1).padStart(2, '0')
  const day = String(normalizedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = computed(() => parseDate(props.modelValue))

function selectDate(date) {
  emit('update:modelValue', serializeDate(date))
  open.value = false
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
          :class="
            cn(
              'min-w-0 flex-1 justify-start text-left font-normal',
              !modelValue && 'text-muted-foreground',
            )
          "
        >
          <CalendarIcon class="mr-2 h-4 w-4 shrink-0" />
          <span class="truncate">{{ formatValue(modelValue) || placeholder }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          :model-value="selectedDate"
          :min-value="parseDate(min)"
          :max-value="parseDate(max)"
          initial-focus
          @update:model-value="selectDate"
        />
      </PopoverContent>
    </Popover>
    <Button
      v-if="clearable && modelValue"
      type="button"
      size="icon"
      variant="outline"
      :disabled="disabled"
      title="Clear date"
      @click="emit('update:modelValue', '')"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Clear date</span>
    </Button>
  </div>
</template>
