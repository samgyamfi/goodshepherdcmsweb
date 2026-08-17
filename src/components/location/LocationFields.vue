<script setup>
import { computed } from 'vue'
import { Building2, ExternalLink } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChurchStore } from '@/stores/church'

defineProps({
  optional: { type: Boolean, default: true },
})

const location = defineModel('location', { type: String, default: '' })
const digitalAddress = defineModel('digitalAddress', { type: String, default: '' })
const churchStore = useChurchStore()

const churchLocation = computed(() => {
  const church = churchStore.church

  return church?.address || church?.city_reference?.name || church?.name || ''
})

const mapsUrl = computed(() => {
  const query = digitalAddress.value || location.value

  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null
})

function useChurchLocation() {
  const church = churchStore.church
  if (!church) return

  location.value = churchLocation.value
  digitalAddress.value = church.digital_address || ''
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <Label>
          Location <span v-if="optional" class="text-muted-foreground">(optional)</span>
        </Label>
        <Input v-model="location" placeholder="Venue or meeting place" />
      </div>
      <div class="space-y-2">
        <Label>
          Digital address <span v-if="optional" class="text-muted-foreground">(optional)</span>
        </Label>
        <Input v-model="digitalAddress" placeholder="GH-000-0000" />
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        :disabled="!churchLocation"
        @click="useChurchLocation"
      >
        <Building2 class="mr-2 h-4 w-4" />
        Use church premises
      </Button>
      <Button
        v-if="mapsUrl"
        as="a"
        type="button"
        size="sm"
        variant="ghost"
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink class="mr-2 h-4 w-4" />
        Check on Google Maps
      </Button>
    </div>
  </div>
</template>
