<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { CalendarDays, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import EventCardGrid from './EventCardGrid.vue'
import EventDetailsDialog from './EventDetailsDialog.vue'
import EventFilters from './EventFilters.vue'
import EventFormSheet from './EventFormSheet.vue'

const props = defineProps({
  service: { type: Object, required: true },
  title: { type: String, default: 'Events' },
  description: { type: String, default: 'Upcoming services, gatherings, and activities.' },
  canCreate: { type: Boolean, default: false },
  canUpdate: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
})

const events = ref([])
const loading = ref(true)
const formOpen = ref(false)
const detailsOpen = ref(false)
const selected = ref(null)
const detailUuid = ref('')
const options = reactive({ categories: [], statuses: [] })
const filters = reactive({ search: '', period: '', category_id: '', status: '', date_from: '', date_to: '' })
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0 })
const { confirm } = useConfirm()
let searchTimer

async function load(page = 1, perPage = meta.value.per_page) {
  loading.value = true
  try {
    const response = await props.service.list({ ...filters, page, perPage })
    events.value = response.data.data.events || []
    meta.value = { ...meta.value, ...response.data.data.meta }
  } finally {
    loading.value = false
  }
}

async function loadOptions() {
  const response = await props.service.formOptions()
  Object.assign(options, response.data.data)
}

function openDetails(event) {
  detailUuid.value = event.uuid
  detailsOpen.value = true
}

async function edit(event) {
  const response = await props.service.show(event.uuid)
  selected.value = response.data.data.event
  formOpen.value = true
}

function create() {
  selected.value = null
  formOpen.value = true
}

async function remove(event) {
  const approved = await confirm({
    title: `Delete ${event.name}?`,
    description: 'The event and all of its uploaded flyers and documents will be deleted. This cannot be undone.',
    confirmLabel: 'Delete event',
  })
  if (!approved) return

  await props.service.remove(event.uuid)
  showToast.success('Event deleted.')
  load(meta.value.current_page)
}

function saved(_event, conflicts) {
  const suffix = conflicts.length ? ` ${conflicts.length} scheduling conflict warning(s) found.` : ''
  showToast.success(`Event saved.${suffix}`)
  load(meta.value.current_page)
}

watch(
  filters,
  () => {
    window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => load(1), 350)
  },
  { deep: true },
)

onMounted(() => Promise.all([load(), loadOptions()]))
</script>

<template>
  <section class="space-y-5">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex items-center gap-2 text-primary"><CalendarDays class="h-5 w-5" /><span class="text-xs font-semibold uppercase">Calendar</span></div>
        <h1 class="mt-1 text-2xl font-bold">{{ title }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <Button v-if="canCreate" class="w-full sm:w-auto" @click="create"><Plus class="mr-2 h-4 w-4" />Create event</Button>
    </header>

    <EventFilters v-model="filters" :categories="options.categories" :statuses="options.statuses" />
    <EventCardGrid
      :events="events"
      :loading="loading"
      :can-edit="canUpdate"
      :can-delete="canDelete"
      @open="openDetails"
      @edit="edit"
      @delete="remove"
    />
    <TablePagination
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :per-page="meta.per_page"
      :total="meta.total"
      :from="meta.from || 0"
      :to="meta.to || 0"
      @page-change="load($event, meta.per_page)"
      @per-page-change="load(1, $event)"
    />
    <EventDetailsDialog v-model:open="detailsOpen" :event-uuid="detailUuid" :service="service" />
    <EventFormSheet v-model:open="formOpen" :event="selected" :service="service" @saved="saved" />
  </section>
</template>
