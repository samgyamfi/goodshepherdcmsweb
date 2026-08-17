<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCountriesStore } from '@/stores/country'

const props = defineProps({
  modelValue: { type: Object, required: true },
  level: { type: String, required: true },
  required: { type: Boolean, default: false },
  filterMode: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
const countriesStore = useCountriesStore()
const { countries } = storeToRefs(countriesStore)
const options = ref({ regions: [], districts: [], cities: [], postal_codes: [] })
const loading = ref(false)

const showsCountry = computed(() => props.level !== 'countries')
const showsRegion = computed(() => ['districts', 'cities', 'postal-codes'].includes(props.level))
const showsCity = computed(() => props.level === 'postal-codes')
const regions = computed(() => options.value.regions ?? [])
const cities = computed(() => (options.value.cities ?? []).filter(
  (city) => same(city.region_id, props.modelValue.region_id),
))

function same(left, right) {
  return String(left ?? '') === String(right ?? '')
}

function update(key, value) {
  const next = { ...props.modelValue, [key]: value }

  if (key === 'country_id') {
    Object.assign(next, { region_id: '', city_id: '' })
  }

  if (key === 'region_id') {
    next.city_id = ''
  }

  emit('update:modelValue', next)
}

async function loadOptions() {
  const country = countries.value.find((item) => same(item.id, props.modelValue.country_id))

  if (!country) {
    options.value = { regions: [], districts: [], cities: [], postal_codes: [] }
    return
  }

  loading.value = true
  try {
    options.value = await countriesStore.fetchGeographyOptions(country.uuid)
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue.country_id, loadOptions)

onMounted(async () => {
  if (!countries.value.length) {
    await countriesStore.fetchCountries({ perPage: 250, is_active: true })
  }

  await loadOptions()
})
</script>

<template>
  <div v-if="showsCountry" class="grid min-w-0 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
    <div class="min-w-[190px] space-y-2">
      <Label>
        Country
        <span v-if="required" class="text-destructive">*</span>
      </Label>
      <Select :model-value="modelValue.country_id" @update:model-value="update('country_id', $event)">
        <SelectTrigger>
          <SelectValue :placeholder="filterMode ? 'All countries' : 'Select country'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-if="filterMode" value="__all__">All countries</SelectItem>
          <SelectItem v-for="country in countries" :key="country.uuid" :value="country.id">
            {{ country.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="showsRegion" class="min-w-[210px] space-y-2">
      <Label>
        Region / State / Province
        <span v-if="required" class="text-destructive">*</span>
      </Label>
      <Select
        :model-value="modelValue.region_id"
        :disabled="!modelValue.country_id || loading"
        @update:model-value="update('region_id', $event)"
      >
        <SelectTrigger>
          <SelectValue :placeholder="filterMode ? 'All regions' : 'Select region'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-if="filterMode" value="__all__">All regions</SelectItem>
          <SelectItem v-for="region in regions" :key="region.uuid" :value="region.id">
            {{ region.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="showsCity" class="min-w-[190px] space-y-2">
      <Label>
        City
        <span v-if="required" class="text-destructive">*</span>
      </Label>
      <Select
        :model-value="modelValue.city_id"
        :disabled="!modelValue.region_id || loading"
        @update:model-value="update('city_id', $event)"
      >
        <SelectTrigger>
          <SelectValue :placeholder="filterMode ? 'All cities' : 'Select city'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-if="filterMode" value="__all__">All cities</SelectItem>
          <SelectItem v-for="city in cities" :key="city.uuid" :value="city.id">
            {{ city.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
