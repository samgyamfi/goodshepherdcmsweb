<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Image, Layers3, Save, UsersRound } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupsService } from '../../services/groupsService'
import { showToast } from '@/utils/toast'
import GroupSlogansEditor from './GroupSlogansEditor.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  group: { type: Object, default: null },
})

const emit = defineEmits(['update:open', 'saved'])
const loading = ref(false)
const optionsLoading = ref(false)
const options = ref({ categories: [], templates: [] })
const logo = ref(null)
const banner = ref(null)
const form = reactive(emptyForm())

const isEditing = computed(() => Boolean(props.group?.uuid))
const title = computed(() => (isEditing.value ? 'Edit group' : 'Create group'))

function emptyForm() {
  return {
    template_uuid: 'custom',
    name: '',
    category_id: 'none',
    description: '',
    motto: '',
    slogans: [],
    wall_content: '',
    is_active: true,
  }
}

function hydrate(group) {
  Object.assign(form, emptyForm(), {
    template_uuid: group?.template?.uuid || 'custom',
    name: group?.name || '',
    category_id: group?.category?.id ? String(group.category.id) : 'none',
    description: group?.description || '',
    motto: group?.motto || '',
    slogans: group?.slogans?.map((slogan) => ({ ...slogan })) || [],
    wall_content: group?.wall_content || '',
    is_active: group?.is_active ?? true,
  })
  logo.value = null
  banner.value = null
}

async function loadOptions() {
  optionsLoading.value = true
  try {
    const response = await groupsService.formOptions()
    options.value = response.data.data
  } finally {
    optionsLoading.value = false
  }
}

function payload() {
  const data = new FormData()
  const values = {
    ...form,
    template_uuid: form.template_uuid === 'custom' ? null : form.template_uuid,
    category_id: form.category_id === 'none' ? null : form.category_id,
    is_active: form.is_active ? '1' : '0',
  }

  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === '') return
    data.append(key, Array.isArray(value) ? JSON.stringify(value) : value)
  })

  data.delete('slogans')
  form.slogans.forEach((slogan, index) => {
    data.append(`slogans[${index}][uuid]`, slogan.uuid)
    data.append(`slogans[${index}][content]`, slogan.content)
  })

  if (logo.value) data.append('logo', logo.value)
  if (banner.value) data.append('banner', banner.value)
  if (isEditing.value) data.append('_method', 'PUT')

  return data
}

async function submit() {
  loading.value = true
  try {
    const response = isEditing.value
      ? await groupsService.update(props.group.uuid, payload())
      : await groupsService.create(payload())
    showToast.success(response.data.message)
    emit('saved', response.data.data.group)
    emit('update:open', false)
  } catch (error) {
    showToast.error(error.response?.data?.message || 'The group could not be saved.')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    hydrate(props.group)
    if (!options.value.categories.length) loadOptions()
  },
)
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="flex w-[96vw] max-w-none flex-col p-0 sm:w-[92vw] lg:w-[86vw] xl:w-[1280px]"
    >
      <SheetHeader class="border-b px-5 py-4 sm:px-7">
        <SheetTitle class="flex items-center gap-2">
          <UsersRound class="h-5 w-5" /> {{ title }}
        </SheetTitle>
      </SheetHeader>

      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="submit">
        <div class="grid gap-8 px-5 py-6 sm:px-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div class="space-y-8">
            <section class="space-y-4">
              <div class="flex items-center gap-2">
                <Layers3 class="h-4 w-4 text-primary" />
                <h3 class="font-semibold">Identity and template</h3>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <Label>Starting point</Label>
                  <Select v-model="form.template_uuid" :disabled="isEditing || optionsLoading">
                    <SelectTrigger><SelectValue placeholder="Custom group" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Create a custom group</SelectItem>
                      <SelectItem
                        v-for="template in options.templates"
                        :key="template.uuid"
                        :value="template.uuid"
                      >
                        {{ template.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label>Category</Label>
                  <Select v-model="form.category_id">
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Uncategorized</SelectItem>
                      <SelectItem
                        v-for="category in options.categories"
                        :key="category.id"
                        :value="String(category.id)"
                      >
                        {{ category.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div class="space-y-2">
                <Label>Group name</Label>
                <Input v-model="form.name" required placeholder="e.g. Men's Ministries" />
              </div>
              <div class="space-y-2">
                <Label>Description</Label>
                <Textarea v-model="form.description" rows="4" />
              </div>
              <div class="space-y-2">
                <Label>Motto</Label>
                <Input v-model="form.motto" />
              </div>
            </section>

            <GroupSlogansEditor v-model="form.slogans" />

            <section class="space-y-2">
              <Label>Group Wall introduction</Label>
              <RichTextEditor v-model="form.wall_content" />
            </section>
          </div>

          <aside class="space-y-5">
            <div class="flex items-center gap-2">
              <Image class="h-4 w-4 text-primary" />
              <h3 class="font-semibold">Branding and publishing</h3>
            </div>
            <FileUpload
              v-model="logo"
              accept="image/*"
              :max-size="5"
              label="Group logo"
              description="Square PNG or JPG works best"
            />
            <FileUpload
              v-model="banner"
              accept="image/*"
              :max-size="10"
              label="Wall banner"
              description="Use a wide image with a clear subject"
            />
            <label class="flex items-center justify-between rounded-md border p-4">
              <span>
                <span class="block text-sm font-medium">Active group</span>
                <span class="text-xs text-muted-foreground">Visible in current group listings</span>
              </span>
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4" />
            </label>
          </aside>
        </div>

        <SheetFooter class="sticky bottom-0 border-t bg-background px-5 py-4 sm:px-7">
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            <Save class="mr-2 h-4 w-4" /> {{ loading ? 'Saving...' : 'Save group' }}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
