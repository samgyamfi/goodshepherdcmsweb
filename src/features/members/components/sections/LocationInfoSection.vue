<script setup>
import { computed } from 'vue'
import GeographyFields from '@/components/geography/GeographyFields.vue'
import { Input } from '@/components/ui/input'

const props = defineProps({
  formData: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:formData'])
const geography = computed({
  get: () => ({
    country_id: props.formData.country_id,
    region_id: props.formData.region_id,
    city_id: props.formData.city_id,
    postal_code_id: props.formData.postal_code_id,
  }),
  set: (value) => emit('update:formData', { ...props.formData, ...value }),
})

function update(field, value) {
  emit('update:formData', { ...props.formData, [field]: value })
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <label for="address" class="text-sm font-medium">Street address</label>
      <Input id="address" :model-value="formData.address" @update:model-value="update('address', $event)" />
    </div>
    <GeographyFields v-model="geography" />
    <p v-if="errors.country_id" class="text-xs text-destructive">{{ errors.country_id }}</p>
    <div class="space-y-2">
      <label for="digital_address" class="text-sm font-medium">Digital address</label>
      <Input id="digital_address" :model-value="formData.digital_address" placeholder="GH-XXX-XXXX" @update:model-value="update('digital_address', $event)" />
    </div>
  </div>
</template>
