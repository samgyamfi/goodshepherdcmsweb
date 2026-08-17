<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Label } from '@/components/ui/label'
import { CreatableCombobox } from '@/components/ui/creatable-combobox'
import { useCountriesStore } from '@/stores/country'
import { geographyService } from '@/features/admin/geography/services/geographyService'

const props = defineProps({
  modelValue: { type: Object, required: true },
  includeDistrict: { type: Boolean, default: false },
  allowCreate: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
const countriesStore = useCountriesStore()
const { countries } = storeToRefs(countriesStore)
const options = ref({ regions: [], districts: [], cities: [], postal_codes: [] })
const creating = ref(false)

const districts = computed(() => options.value.districts.filter((item) => same(item.region_id, props.modelValue.region_id)))
const cities = computed(() => options.value.cities.filter((item) => same(item.region_id, props.modelValue.region_id)))
const postals = computed(() => options.value.postal_codes.filter((item) => same(item.city_id, props.modelValue.city_id)))

function same(left, right) {
  return String(left || '') === String(right || '')
}

function update(key, value) {
  const next = { ...props.modelValue, [key]: value }
  if (key === 'country_id') Object.assign(next, { region_id: '', district_id: '', city_id: '', postal_code_id: '' })
  if (key === 'region_id') Object.assign(next, { district_id: '', city_id: '', postal_code_id: '' })
  if (key === 'city_id') next.postal_code_id = ''
  emit('update:modelValue', next)
}

async function loadOptions() {
  const country = countries.value.find((item) => same(item.id, props.modelValue.country_id))
  options.value = country
    ? await countriesStore.fetchGeographyOptions(country.uuid)
    : { regions: [], districts: [], cities: [], postal_codes: [] }
}

async function createOption(type, key, value, parent) {
  if (!props.allowCreate || !value || Number.isInteger(Number(value))) return
  creating.value = true
  try {
    const payload = type === 'postal-codes'
      ? { postal_code: value, ...parent }
      : { name: value, ...parent }
    const response = await geographyService.create(type, payload)
    const country = countries.value.find((item) => same(item.id, props.modelValue.country_id))
    countriesStore.invalidateGeography(country.uuid)
    await loadOptions()
    update(key, response.data.data.item.id)
  } finally {
    creating.value = false
  }
}

watch(() => props.modelValue.country_id, loadOptions, { immediate: true })
watch(() => props.modelValue.region_id, (value) => createOption('regions', 'region_id', value, { country_id: props.modelValue.country_id }))
watch(() => props.modelValue.district_id, (value) => createOption('districts', 'district_id', value, { region_id: props.modelValue.region_id }))
watch(() => props.modelValue.city_id, (value) => createOption('cities', 'city_id', value, { region_id: props.modelValue.region_id }))
watch(() => props.modelValue.postal_code_id, (value) => createOption('postal-codes', 'postal_code_id', value, { city_id: props.modelValue.city_id }))

onMounted(async () => {
  if (!countries.value.length) await countriesStore.fetchCountries({ perPage: 250, is_active: true })
  await loadOptions()
})
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-2">
      <Label>Country</Label>
      <CreatableCombobox
        :model-value="modelValue.country_id"
        :options="countries"
        :allow-create="false"
        placeholder="Select country"
        @update:model-value="update('country_id', $event)"
      />
    </div>
    <div class="space-y-2">
      <Label>Region / State / Province</Label>
      <CreatableCombobox
        :model-value="modelValue.region_id"
        :options="options.regions"
        :allow-create="allowCreate"
        :disabled="!modelValue.country_id || creating"
        placeholder="Select region"
        @update:model-value="update('region_id', $event)"
      />
    </div>
    <div v-if="includeDistrict" class="space-y-2">
      <Label>District</Label>
      <CreatableCombobox
        :model-value="modelValue.district_id"
        :options="districts"
        :allow-create="allowCreate"
        :disabled="!modelValue.region_id || creating"
        placeholder="Select district"
        @update:model-value="update('district_id', $event)"
      />
    </div>
    <div class="space-y-2">
      <Label>City</Label>
      <CreatableCombobox
        :model-value="modelValue.city_id"
        :options="cities"
        :allow-create="allowCreate"
        :disabled="!modelValue.region_id || creating"
        placeholder="Select city"
        @update:model-value="update('city_id', $event)"
      />
    </div>
    <div class="space-y-2">
      <Label>Postal code</Label>
      <CreatableCombobox
        :model-value="modelValue.postal_code_id"
        :options="postals"
        :allow-create="allowCreate"
        :disabled="!modelValue.city_id || creating"
        placeholder="Select postal code"
        @update:model-value="update('postal_code_id', $event)"
      />
    </div>
  </div>
</template>
