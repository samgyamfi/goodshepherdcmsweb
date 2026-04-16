/**
 * Mirrors App\Enums\TransferRequestStatus (PHP Backed Enum).
 *
 * Usage:
 *   import { TransferRequestStatus } from '@/enums'
 *
 *   TransferRequestStatus.PENDING              // → 'pending'
 *   TransferRequestStatus.label('approved')    // → 'Approved'
 *   TransferRequestStatus.badgeVariant('rejected') // → 'destructive'
 *   TransferRequestStatus.isPending('pending') // → true
 *   TransferRequestStatus.isFinal('approved')  // → true
 */

const CASES = Object.freeze({
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
})

const LABELS = Object.freeze({
  [CASES.PENDING]:   'Pending',
  [CASES.APPROVED]:  'Approved',
  [CASES.REJECTED]:  'Rejected',
  [CASES.CANCELLED]: 'Cancelled',
  [CASES.COMPLETED]: 'Completed',
})

const BADGE_VARIANTS = Object.freeze({
  [CASES.PENDING]:   'secondary',
  [CASES.APPROVED]:  'default',
  [CASES.REJECTED]:  'destructive',
  [CASES.CANCELLED]: 'outline',
  [CASES.COMPLETED]: 'default',
})

export const TransferRequestStatus = Object.freeze({
  ...CASES,

  /** Display label — mirrors TransferRequestStatus::label() */
  label: (value) => LABELS[value] ?? value,

  /** Shadcn Badge variant for a given status */
  badgeVariant: (value) => BADGE_VARIANTS[value] ?? 'outline',

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * Whether the status is pending (can still be acted on).
   * Mirrors TransferRequestStatus::isPending().
   */
  isPending: (value) => value === CASES.PENDING,

  /**
   * Whether the status is a terminal state (no further transitions).
   * Mirrors TransferRequestStatus::isFinal().
   */
  isFinal: (value) =>
    [CASES.APPROVED, CASES.REJECTED, CASES.CANCELLED, CASES.COMPLETED].includes(value),

  /**
   * Options array for Select / dropdown components.
   * @param {boolean} withAll - Prepend an "All" option
   */
  asOptions: (withAll = false) => {
    const opts = Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] }))
    return withAll ? [{ value: null, label: 'All Statuses' }, ...opts] : opts
  },
})
