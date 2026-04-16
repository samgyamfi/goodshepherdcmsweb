<script setup>
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/composables/useConfirm'

const { state, onConfirm, onCancel } = useConfirm()
</script>

<template>
  <AlertDialog :open="state.open" @update:open="onCancel">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ state.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ state.description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="outline" @click="onCancel">
          {{ state.cancelLabel }}
        </Button>
        <Button :variant="state.variant" @click="onConfirm">
          {{ state.confirmLabel }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
