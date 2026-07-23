<script setup>
import { computed } from 'vue'
import { Clock3 } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Select time' },
  disabled: { type: Boolean, default: false },
  interval: { type: Number, default: 15 },
  id: { type: String, default: undefined },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])
const normalizedValue = computed(() =>
  props.modelValue ? props.modelValue.slice(0, 5) : undefined,
)

function updateValue(value) {
  emit('update:modelValue', value === '__none__' ? '' : value)
}

function labelFor(value) {
  const [hour, minute] = value.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`
}

const options = computed(() => {
  const values = []
  const step = Math.max(1, props.interval)

  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0')
    const minute = String(minutes % 60).padStart(2, '0')
    const value = `${hour}:${minute}`
    values.push({ value, label: labelFor(value) })
  }

  return values
})
</script>

<template>
  <Select :model-value="normalizedValue" :disabled="disabled" @update:model-value="updateValue">
    <SelectTrigger :id="id" class="w-full">
      <Clock3 class="mr-2 h-4 w-4 text-muted-foreground" />
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-if="clearable" value="__none__">No time selected</SelectItem>
      <SelectItem v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
