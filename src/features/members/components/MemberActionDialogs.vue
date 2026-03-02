<script setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import MemberForm from '@/features/members/MemberForm.vue'
import MemberDetails from '@/features/members/MemberDetails.vue'

/**
 * MemberActionDialogs Component
 * Contains all member-related action dialogs (form, details, delete)
 * 
 * @props {Boolean} isFormOpen - Whether form dialog is open
 * @props {Boolean} isDetailsOpen - Whether details dialog is open
 * @props {Boolean} isDeleteDialogOpen - Whether delete dialog is open
 * @props {Object} selectedMember - Currently selected member
 * @props {Boolean} isEditMode - Whether form is in edit mode
 * @emits {Event} close-form - Emitted when form dialog is closed
 * @emits {Event} close-details - Emitted when details dialog is closed
 * @emits {Event} close-delete - Emitted when delete dialog is closed
 * @emits {Event} confirm-delete - Emitted when delete is confirmed
 * @emits {Event} submit-form - Emitted when form is submitted
 */

defineProps({
  isFormOpen: {
    type: Boolean,
    default: false,
  },
  isDetailsOpen: {
    type: Boolean,
    default: false,
  },
  isDeleteDialogOpen: {
    type: Boolean,
    default: false,
  },
  selectedMember: {
    type: Object,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'close-form',
  'close-details',
  'close-delete',
  'confirm-delete',
  'submit-form',
])
</script>

<template>
  <!-- Member Form Dialog -->
  <Dialog :open="isFormOpen" @update:open="emit('close-form')">
    <DialogContent class="max-w-6xl max-h-[90vh] overflow-y-auto">
      <MemberForm
        :member="selectedMember"
        :is-edit-mode="isEditMode"
        @submit="emit('submit-form')"
        @cancel="emit('close-form')"
      />
    </DialogContent>
  </Dialog>

  <!-- Member Details Dialog -->
  <MemberDetails
    :member="selectedMember"
    :is-open="isDetailsOpen"
    @close="emit('close-details')"
    @edit="(member) => {
      emit('close-details')
      emit('submit-form')
    }"
  />

  <!-- Delete Confirmation Dialog -->
  <Dialog :open="isDeleteDialogOpen" @update:open="emit('close-delete')">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Member</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {{ selectedMember?.first_name }} {{ selectedMember?.last_name }}?
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="emit('close-delete')">
          Cancel
        </Button>
        <Button variant="destructive" @click="emit('confirm-delete')">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
