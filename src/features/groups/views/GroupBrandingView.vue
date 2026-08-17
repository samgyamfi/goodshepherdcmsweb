<script setup>
import { ref } from 'vue'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import GroupSlogansEditor from '../components/index/GroupSlogansEditor.vue'
import { groupsService } from '../services/groupsService'
import { showToast } from '@/utils/toast'
import helpers from '@/utils/generalHelpers'

const props = defineProps({ group: { type: Object, required: true } })
const logo = ref(null)
const banner = ref(null)
const motto = ref(props.group.motto || '')
const slogans = ref(props.group.slogans?.map((item) => ({ ...item })) || [])
const wallContent = ref(props.group.wall_content || '')
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    const payload = helpers.jsonToFormData({
      _method: 'PUT',
      motto: motto.value,
      wall_content: wallContent.value,
      slogans: slogans.value,
      logo: logo.value,
      banner: banner.value,
    })

    await groupsService.update(props.group.uuid, payload)
    showToast.success('Group branding updated.')
    logo.value = null
    banner.value = null
  } catch {
    // The shared Axios interceptor displays the API validation message.
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" @submit.prevent="save">
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold">Group identity</h2>
        <p class="text-sm text-muted-foreground">Motto, slogans, and Wall introduction.</p>
      </div>
      <div class="space-y-2"><Label>Motto</Label><Input v-model="motto" /></div>
      <GroupSlogansEditor v-model="slogans" />
      <div class="space-y-2">
        <Label>Wall introduction</Label><RichTextEditor v-model="wallContent" />
      </div>
    </div>
    <aside class="space-y-5">
      <h2 class="text-lg font-semibold">Media</h2>
      <FileUpload v-model="logo" accept="image/*" :max-size="5" label="Group logo" />
      <FileUpload v-model="banner" accept="image/*" :max-size="10" label="Wall banner" />
      <Button class="w-full" :disabled="saving || group.is_archived">
        {{ saving ? 'Saving...' : 'Save branding' }}
      </Button>
    </aside>
  </form>
</template>
