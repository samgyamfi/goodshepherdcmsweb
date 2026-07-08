<script setup>
import { reactiveOmit } from '@vueuse/core'
import { CalendarRoot, useForwardPropsEmits } from 'reka-ui'
import { fromDate } from '@internationalized/date'
import { cn } from '@/lib/utils'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
} from '.'

const props = defineProps({
  modelValue: { type: [Date, Object, Array], required: false },
  defaultValue: { type: [Date, Object, Array], required: false },
  placeholder: { type: [Date, Object], required: false },
  defaultPlaceholder: { type: [Date, Object], required: false },
  pagedNavigation: { type: Boolean, required: false },
  preventDeselect: { type: Boolean, required: false },
  weekStartsOn: { type: Number, required: false },
  weekdayFormat: { type: String, required: false },
  calendarLabel: { type: String, required: false },
  fixedWeeks: { type: Boolean, required: false },
  maxValue: { type: [Date, Object], required: false },
  minValue: { type: [Date, Object], required: false },
  locale: { type: String, required: false },
  numberOfMonths: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  readonly: { type: Boolean, required: false },
  initialFocus: { type: Boolean, required: false },
  isDateDisabled: { type: Function, required: false },
  isDateUnavailable: { type: Function, required: false },
  dir: { type: String, required: false },
  nextPage: { type: Function, required: false },
  prevPage: { type: Function, required: false },
  multiple: { type: Boolean, required: false },
  disableDaysOutsideCurrentView: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: String, required: false },
  mode: { type: String, default: 'single' },
})

const emits = defineEmits(['update:modelValue', 'update:placeholder'])

// Convert JS Date to reka-ui CalendarDate
function convertToRekaDate(date) {
  if (!date) return undefined
  if (date instanceof Date) return fromDate(date)
  if (typeof date === 'string') {
    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? undefined : fromDate(parsed)
  }
  // If it's already a CalendarDate (has copy method), return as-is
  if (date && typeof date.copy === 'function') return date
  return undefined
}

// Convert reka-ui CalendarDate to JS Date
function convertToJsDate(date) {
  if (!date) return undefined
  if (typeof date.copy === 'function') {
    // CalendarDate has year, month, day properties (month is 1-based)
    return new Date(date.year, date.month - 1, date.day)
  }
  return date
}

// Handle range value conversion for reka-ui
function convertModelValueForReka(value) {
  if (!value) return undefined

  if (props.mode === 'range') {
    // Handle object format { from: Date, to: Date }
    const rangeStart = value.from ?? value.start
    const rangeEnd = value.to ?? value.end

    if (rangeStart) {
      const fromDateVal = convertToRekaDate(rangeStart)
      const toDateVal = rangeEnd ? convertToRekaDate(rangeEnd) : fromDateVal
      return [fromDateVal, toDateVal].filter(Boolean)
    }
    // Handle array format [Date, Date]
    if (Array.isArray(value)) {
      return value.map(convertToRekaDate).filter(Boolean)
    }
  }

  if (Array.isArray(value)) {
    return value.map(convertToRekaDate).filter(Boolean)
  }

  return convertToRekaDate(value)
}

// Handle reka-ui value conversion back to JS Date
function convertModelValueFromReka(value) {
  if (!value) return undefined

  if (props.mode === 'range' && Array.isArray(value) && value.length >= 1) {
    if (props.modelValue && Object.prototype.hasOwnProperty.call(props.modelValue, 'start')) {
      return {
        start: convertToJsDate(value[0]),
        end: value[1] ? convertToJsDate(value[1]) : convertToJsDate(value[0]),
      }
    }

    return {
      from: convertToJsDate(value[0]),
      to: value[1] ? convertToJsDate(value[1]) : convertToJsDate(value[0]),
    }
  }

  if (Array.isArray(value)) {
    return value.map(convertToJsDate)
  }

  return convertToJsDate(value)
}

const delegatedProps = reactiveOmit(
  props,
  'class',
  'mode',
  'modelValue',
  'defaultValue',
  'placeholder',
  'defaultPlaceholder',
  'minValue',
  'maxValue',
  'multiple',
)

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Watch for modelValue changes from reka-ui and emit in the correct format
function handleUpdateModelValue(newValue) {
  const convertedValue = convertModelValueFromReka(newValue)
  emits('update:modelValue', convertedValue)
}
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
    :model-value="convertModelValueForReka(props.modelValue)"
    :default-value="props.defaultValue ? convertModelValueForReka(props.defaultValue) : undefined"
    :placeholder="convertToRekaDate(props.placeholder)"
    :default-placeholder="convertToRekaDate(props.defaultPlaceholder)"
    :min-value="convertToRekaDate(props.minValue)"
    :max-value="convertToRekaDate(props.maxValue)"
    :multiple="props.mode === 'range' ? false : props.multiple"
    @update:model-value="handleUpdateModelValue"
  >
    <CalendarHeader>
      <CalendarPrevButton />
      <CalendarHeading />
      <CalendarNextButton />
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full"
          >
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
