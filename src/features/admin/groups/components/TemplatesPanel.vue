<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import TemplateFormSheet from './TemplateFormSheet.vue'
import { groupAdministrationService } from '../services/groupAdministrationService'
import { showToast } from '@/utils/toast'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps({ districts: { type: Array, default: () => [] } })
const templates = ref([])
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
const open = ref(false)
const selected = ref(null)
const { confirm } = useConfirm()

async function load(page = 1, perPage = meta.value.per_page) {
  const response = await groupAdministrationService.templates({ page, perPage })
  templates.value = response.data.data.templates
  meta.value = response.data.data.meta
}

function create() {
  selected.value = null
  open.value = true
}

function edit(template) {
  selected.value = template
  open.value = true
}

async function save(payload) {
  selected.value
    ? await groupAdministrationService.updateTemplate(selected.value.uuid, payload)
    : await groupAdministrationService.createTemplate(payload)
  showToast.success('Group template saved.')
  open.value = false
  load()
}

async function remove(template) {
  const approved = await confirm({
    title: `Delete ${template.name}?`,
    description: 'The template will no longer be available for adoption. Existing church groups created from it will not be changed.',
    confirmLabel: 'Delete template',
  })
  if (!approved) return
  await groupAdministrationService.deleteTemplate(template.uuid)
  showToast.success('Group template deleted.')
  load()
}

onMounted(() => load())
</script>

<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Group templates</h2>
        <p class="text-sm text-muted-foreground">
          Platform and district starting points for churches.
        </p>
      </div>
      <Button @click="create"><Plus class="mr-2 h-4 w-4" /> New template</Button>
    </header>
    <div class="divide-y border-y">
      <article
        v-for="template in templates"
        :key="template.uuid"
        class="flex items-start justify-between gap-4 py-4"
      >
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-medium">{{ template.name }}</p>
            <Badge variant="outline">{{ template.scope }}</Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ template.category_name || 'No category'
            }}<span v-if="template.district"> · {{ template.district.name }}</span>
          </p>
        </div>
        <div class="flex gap-1">
          <Button size="sm" variant="outline" @click="edit(template)">Edit</Button>
          <Button size="icon" variant="ghost" title="Delete template" @click="remove(template)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </article>
    </div>
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
    <TemplateFormSheet
      v-model:open="open"
      :template="selected"
      :districts="props.districts"
      @save="save"
    />
  </section>
</template>
