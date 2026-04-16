<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Church } from 'lucide-vue-next'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submitted'])

// State
const churches = ref([])
const selectedChurchId = ref('')
const reason = ref('')
const isSubmitting = ref(false)
const isLoading = ref(false)

// Computed
const isFormValid = computed(() => {
  return selectedChurchId.value && selectedChurchId.value !== 'all'
})

/**
 * Fetch available churches
 */
async function fetchChurches() {
  isLoading.value = true
  try {
    const response = await api.get('/church')
    if (response.data.status) {
      churches.value = response.data.data.churches || []
    }
  } catch {
    showToast.error('Failed to fetch churches')
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    emit('submitted', {
      toChurchId: selectedChurchId.value,
      reason: reason.value,
    })
  } catch {
    showToast.error('Failed to submit request')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Handle close
 */
function handleClose() {
  selectedChurchId.value = ''
  reason.value = ''
  emit('close')
}

// Lifecycle
onMounted(() => {
  if (props.isOpen) {
    fetchChurches()
  }
})
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Church class="h-5 w-5" />
          Request Church Transfer
        </DialogTitle>
        <DialogDescription>
          Submit a request to transfer to a different church. This will be reviewed by the
          destination church administrators.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Church Selection -->
        <div class="space-y-2">
          <Label for="church">Select Destination Church</Label>
          <Select v-model="selectedChurchId">
            <SelectTrigger>
              <SelectValue placeholder="Select a church" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Churches</SelectLabel>
                <SelectItem value="all" disabled>Choose a church...</SelectItem>
                <SelectItem
                  v-for="church in churches"
                  :key="church.id"
                  :value="church.id.toString()"
                >
                  {{ church.name }} ({{ church.city }})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p class="text-xs text-muted-foreground">
            Choose the church you want to transfer to
          </p>
        </div>

        <!-- Reason -->
        <div class="space-y-2">
          <Label for="reason">Reason for Transfer (Optional)</Label>
          <Textarea
            id="reason"
            v-model="reason"
            placeholder="Briefly explain why you want to transfer..."
            rows="4"
            class="resize-none"
          />
          <p class="text-xs text-muted-foreground">
            This helps the church administrators understand your situation
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="handleClose">
          Cancel
        </Button>
        <Button
          type="button"
          :disabled="!isFormValid || isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="isSubmitting" class="flex items-center gap-2">
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
            Submitting...
          </span>
          <span v-else>Submit Request</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
