import { reactive } from 'vue'

/**
 * Programmatic confirmation dialog composable.
 *
 * Mount <ConfirmDialog /> once at the app root (App.vue), then call
 * `confirm()` anywhere in the app:
 *
 *   import { useConfirm } from '@/composables/useConfirm'
 *   const { confirm } = useConfirm()
 *
 *   const ok = await confirm({
 *     title: 'Delete pastor',
 *     description: 'This cannot be undone.',
 *     confirmLabel: 'Delete',       // optional, default 'Confirm'
 *     cancelLabel: 'Cancel',        // optional, default 'Cancel'
 *     variant: 'destructive',       // optional, default 'destructive'
 *   })
 *   if (!ok) return
 */

// Module-level singleton — shared across all callers
const state = reactive({
  open:         false,
  title:        '',
  description:  '',
  confirmLabel: 'Confirm',
  cancelLabel:  'Cancel',
  variant:      'destructive',
  resolve:      null,
})

export function useConfirm() {
  function confirm({
    title        = 'Are you sure?',
    description  = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel  = 'Cancel',
    variant      = 'destructive',
  } = {}) {
    return new Promise((resolve) => {
      state.title        = title
      state.description  = description
      state.confirmLabel = confirmLabel
      state.cancelLabel  = cancelLabel
      state.variant      = variant
      state.resolve      = resolve
      state.open         = true
    })
  }

  function onConfirm() {
    state.open = false
    state.resolve?.(true)
  }

  function onCancel() {
    state.open = false
    state.resolve?.(false)
  }

  return { state, confirm, onConfirm, onCancel }
}
