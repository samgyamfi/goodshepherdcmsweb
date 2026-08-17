<script setup>
import { computed, reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'
import GeographyHierarchyFields from './GeographyHierarchyFields.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  type: { type: String, required: true },
  label: { type: String, required: true },
  item: { type: Object, default: null },
})

const emit = defineEmits(['update:open', 'save'])
const form = reactive({})
const isCountry = computed(() => props.type === 'countries')
const isPostal = computed(() => props.type === 'postal-codes')

function defaults() {
  return {
    name: '',
    postal_code: '',
    code: '',
    iso_code: '',
    dial_code: '',
    flag: null,
    flag_url: '',
    remove_flag: false,
    region: '',
    country_id: '',
    region_id: '',
    city_id: '',
    is_active: true,
  }
}

function payload() {
  const data = { ...form }
  const allowedParent = {
    regions: 'country_id',
    districts: 'region_id',
    cities: 'region_id',
    'postal-codes': 'city_id',
  }[props.type]

  collectParentKeys().forEach((key) => {
    if (key !== allowedParent) delete data[key]
  })

  return data
}

function collectParentKeys() {
  return ['country_id', 'region_id', 'city_id']
}

watch(
  () => [props.open, props.item],
  ([open]) => {
    if (!open) return
    Object.assign(form, defaults(), props.item || {}, {
      flag: null,
      country_id: props.item?.country_id || props.item?.hierarchy?.country?.id || '',
      region_id: props.item?.region_id || props.item?.hierarchy?.region?.id || '',
      city_id: props.item?.city_id || props.item?.hierarchy?.city?.id || '',
    })
    if (isPostal.value) form.postal_code = props.item?.code || ''
  },
  { immediate: true },
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="flex w-[96vw] max-w-none flex-col p-0 sm:w-[88vw] lg:w-[680px]"
    >
      <SheetHeader class="border-b px-5 py-4 sm:px-7">
        <SheetTitle>{{ item ? `Edit ${label}` : `Create ${label}` }}</SheetTitle>
      </SheetHeader>
      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="emit('save', payload())">
        <div class="space-y-5 px-5 py-6 sm:px-7">
          <GeographyHierarchyFields
            v-if="!isCountry"
            :model-value="form"
            :level="type"
            required
            @update:model-value="Object.assign(form, $event)"
          />
          <div class="space-y-2">
            <Label>
              {{ isPostal ? 'Postal code' : 'Name' }} <span class="text-destructive">*</span>
            </Label>
            <Input v-if="isPostal" v-model="form.postal_code" required />
            <Input v-else v-model="form.name" required />
          </div>
          <template v-if="isCountry">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>ISO code <span class="text-destructive">*</span></Label><Input v-model="form.iso_code" required maxlength="3" />
              </div>
              <div class="space-y-2">
                <Label>Dial code <span class="text-muted-foreground">(optional)</span></Label><Input v-model="form.dial_code" placeholder="+233" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>World region <span class="text-destructive">*</span></Label
              ><Input v-model="form.region" required placeholder="Africa" />
            </div>
            <div v-if="form.flag_url && !form.remove_flag" class="space-y-2">
              <Label>Current flag</Label>
              <div class="flex items-center gap-4 rounded-md border p-3">
                <img
                  :src="form.flag_url"
                  :alt="`${form.name} flag`"
                  class="h-12 w-20 rounded object-cover"
                />
                <Button type="button" variant="outline" size="sm" @click="form.remove_flag = true">
                  Remove flag
                </Button>
              </div>
            </div>
            <FileUpload
              v-model="form.flag"
              accept="image/jpeg,image/png,image/webp"
              :max-size="2"
              label="Flag image (optional)"
              description="Upload a JPG, PNG, or WebP flag image"
            />
          </template>
          <div v-else-if="!isPostal" class="space-y-2">
            <Label>Short code (optional)</Label><Input v-model="form.code" />
          </div>
          <label class="flex items-center justify-between rounded-md border p-4">
            <span
              ><b class="block text-sm">Active</b
              ><small class="text-muted-foreground">Available in location selectors.</small></span
            >
            <Switch v-model="form.is_active" />
          </label>
        </div>
        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-7">
          <Button type="button" variant="outline" @click="emit('update:open', false)"
            >Cancel</Button
          >
          <Button type="submit">Save {{ label.toLowerCase() }}</Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
