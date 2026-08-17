<script setup>
import { computed } from 'vue'
import { Time } from '@internationalized/date'
import { Clock3, X } from 'lucide-vue-next'
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Select time' },
  disabled: { type: Boolean, default: false },
  interval: { type: Number, default: 1 },
  id: { type: String, default: undefined },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

const timeValue = computed(() => {
  if (!props.modelValue) return undefined

  const [hour, minute, second = 0] = props.modelValue.split(':').map(Number)
  if ([hour, minute, second].some(Number.isNaN)) return undefined

  return new Time(hour, minute, second)
})

const step = computed(() => ({ minute: Math.max(1, props.interval) }))

function updateValue(value) {
  if (!value) {
    emit('update:modelValue', '')
    return
  }

  const hour = String(value.hour).padStart(2, '0')
  const minute = String(value.minute).padStart(2, '0')
  emit('update:modelValue', `${hour}:${minute}`)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <TimeFieldRoot
      :id="id"
      :model-value="timeValue"
      :disabled="disabled"
      :step="step"
      :step-snapping="true"
      granularity="minute"
      :hour-cycle="12"
      class="flex h-10 min-w-0 flex-1 items-center rounded-md border border-input bg-background px-3 text-sm focus-within:ring-2 focus-within:ring-ring"
      @update:model-value="updateValue"
    >
      <template #default="{ segments }">
        <Clock3 class="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <div class="flex items-center" :aria-label="placeholder">
          <TimeFieldInput
            v-for="(segment, index) in segments"
            :key="`${segment.part}-${index}`"
            :part="segment.part"
            class="rounded px-0.5 outline-none focus:bg-accent focus:text-accent-foreground data-[placeholder]:text-muted-foreground"
          >
            {{ segment.value }}
          </TimeFieldInput>
        </div>
      </template>
    </TimeFieldRoot>

    <Button
      v-if="clearable && modelValue"
      type="button"
      size="icon"
      variant="ghost"
      title="Clear time"
      :disabled="disabled"
      @click="updateValue(undefined)"
    >
      <X class="h-4 w-4" />
    </Button>
  </div>
</template>
