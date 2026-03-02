<script setup>
import { ref, computed } from 'vue'
import { Upload, FileText, X, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
  accept: {
    type: String,
    default: '.xlsx,.xls,.csv',
  },
  maxSize: {
    type: Number,
    default: 10, // MB
  },
  label: {
    type: String,
    default: 'Upload File',
  },
  description: {
    type: String,
    default: 'Drag and drop your file here or click to browse',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'error', 'change'])

const fileInput = ref(null)
const isDragging = ref(false)
const error = ref(null)

/**
 * Selected file
 */
const selectedFile = computed(() => props.modelValue)

/**
 * File name for display
 */
const fileName = computed(() => {
  if (!selectedFile.value) return ''
  return selectedFile.value.name
})

/**
 * File size in MB
 */
const fileSize = computed(() => {
  if (!selectedFile.value) return 0
  return (selectedFile.value.size / (1024 * 1024)).toFixed(2)
})

/**
 * Handle file selection
 */
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

/**
 * Handle drag over
 */
function handleDragOver(event) {
  event.preventDefault()
  if (!props.disabled) {
    isDragging.value = true
  }
}

/**
 * Handle drag leave
 */
function handleDragLeave() {
  isDragging.value = false
}

/**
 * Handle drop
 */
function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false

  if (props.disabled) return

  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

/**
 * Validate and set file
 */
function validateAndSetFile(file) {
  error.value = null

  // Check file size
  const sizeInMB = file.size / (1024 * 1024)
  if (sizeInMB > props.maxSize) {
    error.value = `File size exceeds ${props.maxSize}MB limit`
    emit('error', error.value)
    return
  }

  // Check file type
  const allowedTypes = props.accept.split(',').map((type) => type.trim().toLowerCase())
  const fileType = file.name.toLowerCase().split('.').pop()
  const fileMimeType = file.type

  const isAllowed =
    allowedTypes.some((type) => {
      const cleanType = type.replace('.', '')
      return fileType === cleanType || fileMimeType.includes(cleanType)
    }) || allowedTypes.includes('*/*')

  if (!isAllowed) {
    error.value = `Invalid file type. Accepted: ${props.accept}`
    emit('error', error.value)
    return
  }

  emit('update:modelValue', file)
  emit('change', file)
}

/**
 * Clear selected file
 */
function clearFile() {
  emit('update:modelValue', null)
  emit('change', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Trigger file input
 */
function triggerFileInput() {
  if (!props.disabled && fileInput.value) {
    fileInput.value.click()
  }
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>

    <!-- Dropzone -->
    <div
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      class="relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer"
      :class="[
        isDragging
          ? 'border-primary bg-primary/5'
          : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-muted-foreground/25 hover:border-primary hover:bg-accent',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :disabled="disabled"
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="!selectedFile" class="text-center">
        <Upload class="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p class="text-sm font-medium">{{ description }}</p>
        <p class="text-xs text-muted-foreground mt-1">
          Maximum file size: {{ maxSize }}MB
        </p>
      </div>

      <!-- Selected File Display -->
      <div v-else class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ fileName }}</p>
            <p class="text-xs text-muted-foreground">{{ fileSize }} MB</p>
          </div>
        </div>
        <button
          type="button"
          class="p-2 hover:bg-destructive/10 rounded-full transition-colors"
          @click.stop="clearFile"
        >
          <X class="h-4 w-4 text-destructive" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

    <!-- Success Message -->
    <p v-if="selectedFile && !error" class="text-xs text-green-600 flex items-center gap-1">
      <Check class="h-3 w-3" />
      File ready for upload
    </p>
  </div>
</template>
