<script setup>
import { computed, ref, watch } from 'vue'
import { CalendarIcon, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  monthYearNavigation: { type: Boolean, default: true },
  startYear: { type: Number, default: () => new Date().getFullYear() - 120 },
  endYear: { type: Number, default: () => new Date().getFullYear() + 10 },
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

function normalizeDate(date) {
  if (!date) return undefined
  if (date instanceof Date) return date
  if (Number.isInteger(date.year) && Number.isInteger(date.month) && Number.isInteger(date.day)) {
    return new Date(date.year, date.month - 1, date.day)
  }

  return undefined
}

const selectedDate = computed(() => parseDate(props.modelValue))
const displayMonth = ref(selectedDate.value || new Date())

const monthOptions = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
]

const yearOptions = computed(() => {
  const start = Math.min(props.startYear, props.endYear)
  const end = Math.max(props.startYear, props.endYear)

  return Array.from({ length: end - start + 1 }, (_, index) => String(end - index))
})

const selectedMonth = computed(() => String(displayMonth.value.getMonth()))
const selectedYear = computed(() => String(displayMonth.value.getFullYear()))

watch(selectedDate, (date) => {
  if (date) {
    displayMonth.value = date
  }
})

function selectDate(date) {
  emit('update:modelValue', serializeDate(date))
  open.value = false
}

function updateDisplayMonth(month) {
  displayMonth.value = new Date(displayMonth.value.getFullYear(), Number(month), 1)
}

function updateDisplayYear(year) {
  displayMonth.value = new Date(Number(year), displayMonth.value.getMonth(), 1)
}

function updatePlaceholder(value) {
  const date = normalizeDate(value)

  if (date) {
    displayMonth.value = date
  }
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
        <div v-if="monthYearNavigation" class="grid grid-cols-2 gap-2 border-b p-3">
          <Select :model-value="selectedMonth" @update:model-value="updateDisplayMonth">
            <SelectTrigger class="h-9">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="month in monthOptions" :key="month.value" :value="month.value">
                  {{ month.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select :model-value="selectedYear" @update:model-value="updateDisplayYear">
            <SelectTrigger class="h-9">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="year in yearOptions" :key="year" :value="year">
                  {{ year }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Calendar
          :model-value="selectedDate"
          :placeholder="displayMonth"
          :min-value="parseDate(min)"
          :max-value="parseDate(max)"
          initial-focus
          @update:placeholder="updatePlaceholder"
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
