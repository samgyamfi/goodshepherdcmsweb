<script setup>
import { reactive, watch } from 'vue'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import GroupSlogansEditor from '@/features/groups/components/index/GroupSlogansEditor.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  template: { type: Object, default: null },
  districts: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:open', 'save'])
const form = reactive({})

function defaults() {
  return {
    scope: 'platform',
    district_id: 'none',
    name: '',
    category_name: '',
    description: '',
    motto: '',
    slogans: [],
    is_active: true,
    logo: null,
    banner: null,
    remove_logo: false,
    remove_banner: false,
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    Object.assign(form, defaults(), props.template || {})
    form.district_id = props.template?.district?.id
      ? String(props.template.district.id)
      : 'none'
  },
)

function submit() {
  emit('save', {
    scope: form.scope,
    name: form.name,
    category_name: form.category_name,
    description: form.description,
    motto: form.motto,
    slogans: form.slogans,
    is_active: form.is_active,
    logo: form.logo,
    banner: form.banner,
    remove_logo: form.remove_logo,
    remove_banner: form.remove_banner,
    district_id: form.scope === 'district' && form.district_id !== 'none'
      ? Number(form.district_id)
      : null,
  })
}
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent side="right" class="flex w-[97vw] max-w-none flex-col p-0 sm:w-[93vw] lg:w-[86vw] xl:w-[1180px]">
      <SheetHeader class="border-b px-5 py-4 sm:px-7">
        <SheetTitle>{{ template ? 'Edit template' : 'Create group template' }}</SheetTitle>
      </SheetHeader>
      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="submit">
        <div class="grid gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label>Scope</Label>
              <Select v-model="form.scope">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="district">District</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div v-if="form.scope === 'district'" class="space-y-2">
              <Label>District</Label>
              <Select v-model="form.district_id">
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="district in districts" :key="district.id" :value="String(district.id)">
                    {{ district.name }} · {{ district.region }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2"><Label>Name</Label><Input v-model="form.name" required /></div>
            <div class="space-y-2"><Label>Default category</Label><Input v-model="form.category_name" /></div>
          </div>
          <div class="space-y-2"><Label>Description</Label><Textarea v-model="form.description" rows="4" /></div>
          <div class="space-y-2"><Label>Motto</Label><Input v-model="form.motto" /></div>
          <GroupSlogansEditor v-model="form.slogans" />
          </div>
          <div class="space-y-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div><h3 class="font-semibold">Template media</h3><p class="text-sm text-muted-foreground">Churches receive independent copies when they adopt this template.</p></div>
            <div v-if="template?.media?.logo && !form.remove_logo" class="space-y-2">
              <Label>Current logo</Label><img :src="template.media.logo.preview_url" :alt="`${template.name} logo`" class="h-28 w-28 rounded-md border object-cover" />
              <Button type="button" size="sm" variant="outline" @click="form.remove_logo = true">Remove current logo</Button>
            </div>
            <FileUpload v-model="form.logo" accept="image/*" :max-size="5" label="New logo" description="Drop or select a logo image" />
            <div v-if="template?.media?.banner && !form.remove_banner" class="space-y-2">
              <Label>Current banner</Label><img :src="template.media.banner.preview_url" :alt="`${template.name} banner`" class="aspect-[3/1] w-full rounded-md border object-cover" />
              <Button type="button" size="sm" variant="outline" @click="form.remove_banner = true">Remove current banner</Button>
            </div>
            <FileUpload v-model="form.banner" accept="image/*" :max-size="10" label="New banner" description="Drop or select a banner image" />
          </div>
        </div>
        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-7">
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit">Save template</Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
