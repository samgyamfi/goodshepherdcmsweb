<script setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Pencil, X } from 'lucide-vue-next'

// Detail components
import MemberProfileCard from './components/details/MemberProfileCard.vue'
import MemberPersonalInfo from './components/details/MemberPersonalInfo.vue'
import MemberLocationInfo from './components/details/MemberLocationInfo.vue'
import MemberSpiritualInfo from './components/details/MemberSpiritualInfo.vue'
import MemberGroupsList from './components/details/MemberGroupsList.vue'

const props = defineProps({
  member: {
    type: Object,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'edit'])

/**
 * Handle edit click
 */
function handleEdit() {
  emit('edit', props.member)
}

/**
 * Handle close
 */
function handleClose() {
  emit('close')
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div v-if="member" class="space-y-4">
          <!-- Profile Card -->
          <MemberProfileCard :member="member" />

          <!-- Quick Actions -->
          <div class="flex justify-end">
            <Button variant="outline" size="sm" @click="handleEdit">
              <Pencil class="mr-2 h-4 w-4" />
              Edit Member
            </Button>
            <Button variant="ghost" size="icon" class="ml-2" @click="handleClose">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          <!-- Personal Information -->
          <MemberPersonalInfo :member="member" />

          <!-- Location Information -->
          <MemberLocationInfo :member="member" />

          <!-- Spiritual Information -->
          <MemberSpiritualInfo :member="member" />

          <!-- Groups List -->
          <MemberGroupsList :member="member" />
        </div>

        <div v-else>
          <DialogTitle>Member Not Found</DialogTitle>
          <DialogDescription>
            The member information could not be loaded.
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogFooter v-if="!member">
        <Button @click="handleClose">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
