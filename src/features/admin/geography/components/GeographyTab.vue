<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { Archive, MoreHorizontal, Pencil, Plus, RotateCcw, Search } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import { geographyService } from '../services/geographyService'
import GeographyFormSheet from './GeographyFormSheet.vue'
import GeographyHierarchyFields from './GeographyHierarchyFields.vue'

const props = defineProps({
  type: { type: String, required: true },
  label: { type: String, required: true },
  parentLabel: { type: String, default: '' },
})

const items = ref([])
const loading = ref(true)
const archived = ref(false)
const search = ref('')
const sheetOpen = ref(false)
const selected = ref(null)
const hierarchyFilters = reactive({ country_id: '', region_id: '', city_id: '' })
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0 })
const { confirm } = useConfirm()
let timer

async function load(page = 1, perPage = meta.value.per_page) {
  loading.value = true
  try {
    const response = await geographyService.list(props.type, {
      search: search.value,
      archived: archived.value ? 1 : 0,
      page,
      perPage,
      ...filterParams(),
    })
    items.value = response.data.data.items || []
    meta.value = { ...meta.value, ...response.data.data.meta }
  } finally {
    loading.value = false
  }
}

function filterParams() {
  return Object.fromEntries(
    Object.entries(hierarchyFilters)
      .filter(([, value]) => value && value !== '__all__'),
  )
}

function create() {
  selected.value = null
  sheetOpen.value = true
}

function edit(item) {
  selected.value = item
  sheetOpen.value = true
}

async function save(payload) {
  const response = selected.value
    ? await geographyService.update(props.type, selected.value.uuid, payload)
    : await geographyService.create(props.type, payload)
  showToast.success(response.data.message)
  sheetOpen.value = false
  load(meta.value.current_page)
}

async function archiveItem(item) {
  const approved = await confirm({
    title: `Archive ${item.name}?`,
    description: 'It will stop appearing in active selectors. Existing church and profile records will retain their historical reference.',
    confirmLabel: 'Archive',
  })
  if (!approved) return
  await geographyService.archive(props.type, item.uuid)
  showToast.success(`${props.label} archived.`)
  load()
}

async function restoreItem(item) {
  await geographyService.restore(props.type, item.uuid)
  showToast.success(`${props.label} restored.`)
  load()
}

watch(search, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => load(1), 350)
})
watch(archived, () => load(1))
watch(hierarchyFilters, () => load(1), { deep: true })
onMounted(load)
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div class="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-end">
        <label class="relative min-w-0 flex-1 lg:max-w-sm">
          <span class="sr-only">Search {{ label.toLowerCase() }}s</span>
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input v-model="search" class="pl-9" :placeholder="`Search ${label.toLowerCase()}s`" />
        </label>
        <GeographyHierarchyFields
          v-if="type !== 'countries'"
          :model-value="hierarchyFilters"
          :level="type"
          filter-mode
          @update:model-value="Object.assign(hierarchyFilters, $event)"
        />
        <Button variant="outline" @click="archived = !archived">
          {{ archived ? 'Show active' : 'Show archived' }}
        </Button>
      </div>
      <Button class="shrink-0 self-end" @click="create">
        <Plus class="mr-2 h-4 w-4" />Create {{ label.toLowerCase() }}
      </Button>
    </div>

    <div v-if="loading" class="h-72 animate-pulse rounded-md bg-muted" />
    <div v-else class="overflow-x-auto rounded-md border">
      <table class="w-full min-w-[760px] text-sm">
        <thead class="border-b bg-muted/50 text-left">
          <tr>
            <th v-if="type === 'countries'" class="w-20 px-4 py-3 font-medium">Flag</th>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">{{ type === 'countries' ? 'ISO code' : 'Code' }}</th>
            <th v-if="type !== 'countries'" class="px-4 py-3 font-medium">{{ parentLabel }}</th>
            <th class="w-28 px-4 py-3 font-medium">Status</th>
            <th class="w-20 px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.uuid">
            <td v-if="type === 'countries'" class="px-4 py-3">
              <img
                v-if="item.flag_url"
                :src="item.flag_url"
                :alt="`${item.name} flag`"
                class="h-8 w-12 rounded-sm border object-cover"
              />
              <span v-else class="text-xs text-muted-foreground">None</span>
            </td>
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3 text-muted-foreground">{{ item.iso_code || item.code || '-' }}</td>
            <td v-if="type !== 'countries'" class="px-4 py-3 text-muted-foreground">
              {{ item.parent?.name || '-' }}
            </td>
            <td class="px-4 py-3">
              <Badge :variant="item.is_active ? 'default' : 'secondary'">
                {{ item.is_active ? 'Active' : 'Inactive' }}
              </Badge>
            </td>
            <td class="px-4 py-3 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="ghost"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem v-if="!archived" @click="edit(item)"><Pencil class="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                  <DropdownMenuItem v-if="!archived" class="text-destructive" @click="archiveItem(item)"><Archive class="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                  <DropdownMenuItem v-else @click="restoreItem(item)"><RotateCcw class="mr-2 h-4 w-4" />Restore</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="5" class="py-14 text-center text-muted-foreground">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <TablePagination
      :current-page="meta.current_page" :last-page="meta.last_page" :per-page="meta.per_page"
      :total="meta.total" :from="meta.from || 0" :to="meta.to || 0"
      @page-change="load($event, meta.per_page)" @per-page-change="load(1, $event)"
    />
    <GeographyFormSheet
      v-model:open="sheetOpen" :type="type" :label="label" :item="selected"
      @save="save"
    />
  </section>
</template>
