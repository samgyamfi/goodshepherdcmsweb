<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { FileUp, Download, AlertCircle } from 'lucide-vue-next'
import { membersService } from '@/services/members/members'
import { showToast } from '@/utils/toast'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'import'])

/**
 * Selected file
 */
const selectedFile = ref(null)

/**
 * Loading state
 */
const isImporting = ref(false)
const isDownloadingTemplate = ref(false)

/**
 * Handle import
 */
async function handleImport() {
  if (!selectedFile.value) return

  isImporting.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    emit('import', formData)
  } catch (error) {
    console.error('Import error:', error)
  } finally {
    isImporting.value = false
  }
}

/**
 * Handle close
 */
function handleClose() {
  emit('close')
  selectedFile.value = null
}

/**
 * Download template
 */
async function downloadTemplate() {
  isDownloadingTemplate.value = true

  try {
    const blob = await membersService.downloadImportTemplate()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'members_import_template.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Template download error:', error)
    showToast.error('Could not download import template')
  } finally {
    isDownloadingTemplate.value = false
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <FileUp class="h-5 w-5" />
          Import Members
        </DialogTitle>
        <DialogDescription>
          Upload an Excel or CSV file to bulk import members. The system will automatically detect and update existing members by phone or email.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- File Upload -->
        <FileUpload
          v-model="selectedFile"
          label="Select File"
          description="Drag and drop your file here or click to browse"
          accept=".xlsx,.xls,.csv"
          :max-size="10"
        />

        <!-- Important Information -->
        <div class="rounded-lg border bg-muted/50 p-4">
          <div class="flex items-start gap-3">
            <AlertCircle class="h-5 w-5 text-amber-500 mt-0.5" />
            <div class="space-y-2 text-sm">
              <p class="font-medium">Important Notes:</p>
              <ul class="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Required fields: First Name, Last Name, Phone</li>
                <li>Phone numbers must be unique in the system</li>
                <li>Email addresses must be valid and unique</li>
                <li>Dates should be in YYYY-MM-DD format</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Download Template Button -->
        <div class="flex justify-between items-center">
          <p class="text-sm text-muted-foreground">
            Need a template?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            :disabled="isDownloadingTemplate"
            @click="downloadTemplate"
          >
            <Download class="mr-2 h-4 w-4" />
            {{ isDownloadingTemplate ? 'Downloading...' : 'Download Template' }}
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button
          type="button"
          :disabled="!selectedFile || isImporting"
          @click="handleImport"
        >
          <span v-if="isImporting" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Importing...
          </span>
          <span v-else class="flex items-center gap-2">
            <FileUp class="h-4 w-4" />
            Import Members
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
