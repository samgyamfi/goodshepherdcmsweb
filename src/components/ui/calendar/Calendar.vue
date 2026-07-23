<script setup>
import { reactiveOmit } from '@vueuse/core'
import {
  CalendarRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
  useForwardProps,
} from 'reka-ui'
import { fromDate } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
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
function isCalendarDate(date) {
  return (
    date &&
    Number.isInteger(date.year) &&
    Number.isInteger(date.month) &&
    Number.isInteger(date.day)
  )
}

function convertToRekaDate(date) {
  if (!date) return undefined
  if (date instanceof Date) return fromDate(date)
  if (typeof date === 'string') {
    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? undefined : fromDate(parsed)
  }
  if (isCalendarDate(date)) return date

  return undefined
}

function convertToJsDate(date) {
  if (!date) return undefined
  if (date instanceof Date) return date
  if (isCalendarDate(date)) return new Date(date.year, date.month - 1, date.day)

  return undefined
}

function convertModelValueForReka(value) {
  if (!value) return undefined

  if (props.mode === 'range') {
    const rangeStart = value.from ?? value.start
    const rangeEnd = value.to ?? value.end

    return {
      start: convertToRekaDate(rangeStart),
      end: convertToRekaDate(rangeEnd),
    }
  }

  if (Array.isArray(value)) {
    return value.map(convertToRekaDate).filter(Boolean)
  }

  return convertToRekaDate(value)
}

function convertModelValueFromReka(value) {
  if (!value) return undefined

  if (props.mode === 'range') {
    const start = convertToJsDate(value.start ?? value.from)
    const end = convertToJsDate(value.end ?? value.to)

    if (props.modelValue && Object.prototype.hasOwnProperty.call(props.modelValue, 'start')) {
      return { start, end }
    }

    return { from: start, to: end }
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

const forwarded = useForwardProps(delegatedProps)

// Watch for modelValue changes from reka-ui and emit in the correct format
function handleUpdateModelValue(newValue) {
  const convertedValue = convertModelValueFromReka(newValue)
  emits('update:modelValue', convertedValue)
}

function handleUpdatePlaceholder(newValue) {
  emits('update:placeholder', convertToJsDate(newValue))
}
</script>

<template>
  <RangeCalendarRoot
    v-if="props.mode === 'range'"
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
    :model-value="convertModelValueForReka(props.modelValue)"
    :default-value="props.defaultValue ? convertModelValueForReka(props.defaultValue) : undefined"
    :placeholder="convertToRekaDate(props.placeholder)"
    :default-placeholder="convertToRekaDate(props.defaultPlaceholder)"
    :min-value="convertToRekaDate(props.minValue)"
    :max-value="convertToRekaDate(props.maxValue)"
    @update:model-value="handleUpdateModelValue"
    @update:placeholder="handleUpdatePlaceholder"
  >
    <RangeCalendarHeader class="relative flex w-full items-center justify-between pt-1">
      <RangeCalendarPrev
        :class="
          cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          )
        "
      >
        <ChevronLeft class="h-4 w-4" />
      </RangeCalendarPrev>
      <RangeCalendarHeading class="text-sm font-medium" />
      <RangeCalendarNext
        :class="
          cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          )
        "
      >
        <ChevronRight class="h-4 w-4" />
      </RangeCalendarNext>
    </RangeCalendarHeader>

    <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full border-collapse space-y-1"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="flex">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`range-week-${index}`"
            class="mt-2 flex w-full"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="
                  cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0 font-normal',
                    'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                    'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground',
                    'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground',
                    '[&[data-today]:not([data-selected])]:bg-accent',
                    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                    'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
                    'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50',
                  )
                "
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>

  <CalendarRoot
    v-else
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
    :model-value="convertModelValueForReka(props.modelValue)"
    :default-value="props.defaultValue ? convertModelValueForReka(props.defaultValue) : undefined"
    :placeholder="convertToRekaDate(props.placeholder)"
    :default-placeholder="convertToRekaDate(props.defaultPlaceholder)"
    :min-value="convertToRekaDate(props.minValue)"
    :max-value="convertToRekaDate(props.maxValue)"
    :multiple="props.multiple"
    @update:model-value="handleUpdateModelValue"
    @update:placeholder="handleUpdatePlaceholder"
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
