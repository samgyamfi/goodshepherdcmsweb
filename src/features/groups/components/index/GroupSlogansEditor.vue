<script setup>
import { Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor.vue'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])
const { confirm } = useConfirm()

function addSlogan() {
  emit('update:modelValue', [...props.modelValue, { uuid: crypto.randomUUID(), content: '' }])
}

function updateSlogan(index, content) {
  const slogans = props.modelValue.map((slogan, position) =>
    position === index ? { ...slogan, content } : slogan,
  )
  emit('update:modelValue', slogans)
}

async function removeSlogan(index) {
  const confirmed = await confirm({
    title: `Remove slogan ${index + 1}?`,
    description:
      'The slogan will be removed from this form. Saving the group or branding changes will permanently remove it from the Group Wall.',
    confirmLabel: 'Remove slogan',
  })
  if (!confirmed) return

  emit(
    'update:modelValue',
    props.modelValue.filter((_, position) => position !== index),
  )
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h4 class="text-sm font-medium">Slogans and chants</h4>
        <p class="text-xs text-muted-foreground">Add each call-and-response item separately.</p>
      </div>
      <Button type="button" size="sm" variant="outline" @click="addSlogan">
        <Plus class="mr-2 h-4 w-4" /> Add slogan
      </Button>
    </div>

    <div
      v-for="(slogan, index) in modelValue"
      :key="slogan.uuid"
      class="rounded-md border p-3"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-medium text-muted-foreground">Slogan {{ index + 1 }}</span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          title="Remove slogan"
          @click="removeSlogan(index)"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
      <RichTextEditor
        :model-value="slogan.content"
        @update:model-value="updateSlogan(index, $event)"
      />
    </div>
  </div>
</template>
