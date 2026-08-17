<script setup>
import { computed, ref } from 'vue'
import { FileText, ImagePlus, Trash2, Upload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({
  images: { type: Array, default: () => [] },
  documents: { type: Array, default: () => [] },
  existingImages: { type: Array, default: () => [] },
  existingDocuments: { type: Array, default: () => [] },
  removedUuids: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:images',
  'update:documents',
  'update:removedUuids',
])

const imageInput = ref(null)
const documentInput = ref(null)
const visibleImages = computed(() => props.existingImages.filter((file) => !props.removedUuids.includes(file.uuid)))
const visibleDocuments = computed(() => props.existingDocuments.filter((file) => !props.removedUuids.includes(file.uuid)))

function selectFiles(event, type) {
  const files = [...event.target.files]
  const current = type === 'images' ? props.images : props.documents
  const maximum = type === 'images' ? 2 - visibleImages.value.length : 5 - visibleDocuments.value.length
  emit(`update:${type}`, [...current, ...files].slice(0, Math.max(maximum, 0)))
  event.target.value = ''
}

function removeNew(type, index) {
  const current = type === 'images' ? props.images : props.documents
  emit(`update:${type}`, current.filter((_, itemIndex) => itemIndex !== index))
}

function removeExisting(uuid) {
  emit('update:removedUuids', [...new Set([...props.removedUuids, uuid])])
}
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-2">
    <section class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-semibold">Flyer images</h4>
          <p class="text-xs text-muted-foreground">Up to 2 JPG, PNG, or WebP files, 10 MB each.</p>
        </div>
        <Button type="button" size="sm" variant="outline" @click="imageInput?.click()">
          <ImagePlus class="mr-2 h-4 w-4" /> Add images
        </Button>
      </div>
      <input
        ref="imageInput"
        class="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        @change="selectFiles($event, 'images')"
      />
      <div class="space-y-2">
        <div v-for="file in visibleImages" :key="file.uuid" class="flex items-center gap-3 rounded-md border p-2">
          <img :src="file.preview_url" :alt="file.filename" class="h-12 w-16 rounded object-cover" />
          <span class="min-w-0 flex-1 truncate text-sm">{{ file.filename }}</span>
          <Button type="button" size="icon" variant="ghost" title="Remove image" @click="removeExisting(file.uuid)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
        <div v-for="(file, index) in images" :key="`${file.name}-${index}`" class="flex items-center gap-3 rounded-md border p-3">
          <Upload class="h-4 w-4 text-muted-foreground" />
          <span class="min-w-0 flex-1 truncate text-sm">{{ file.name }}</span>
          <Button type="button" size="icon" variant="ghost" title="Remove image" @click="removeNew('images', index)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-semibold">Documents</h4>
          <p class="text-xs text-muted-foreground">Up to 5 office, PDF, CSV, or text files, 20 MB each.</p>
        </div>
        <Button type="button" size="sm" variant="outline" @click="documentInput?.click()">
          <FileText class="mr-2 h-4 w-4" /> Add files
        </Button>
      </div>
      <input
        ref="documentInput"
        class="hidden"
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt"
        multiple
        @change="selectFiles($event, 'documents')"
      />
      <div class="space-y-2">
        <div v-for="file in visibleDocuments" :key="file.uuid" class="flex items-center gap-3 rounded-md border p-3">
          <FileText class="h-4 w-4 text-muted-foreground" />
          <span class="min-w-0 flex-1 truncate text-sm">{{ file.filename }}</span>
          <Button type="button" size="icon" variant="ghost" title="Remove document" @click="removeExisting(file.uuid)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
        <div v-for="(file, index) in documents" :key="`${file.name}-${index}`" class="flex items-center gap-3 rounded-md border p-3">
          <Upload class="h-4 w-4 text-muted-foreground" />
          <span class="min-w-0 flex-1 truncate text-sm">{{ file.name }}</span>
          <Button type="button" size="icon" variant="ghost" title="Remove document" @click="removeNew('documents', index)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
