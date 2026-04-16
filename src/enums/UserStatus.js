/**
 * Mirrors App\Enums\UserStatus (PHP Backed Enum).
 *
 * Usage:
 *   import { UserStatus } from '@/enums'
 *
 *   UserStatus.ACTIVE                    // → 'active'
 *   UserStatus.label('pending_approval') // → 'Pending Approval'
 *   UserStatus.badgeVariant('suspended') // → 'destructive'
 *   UserStatus.canApprove('pending')     // → true
 *   UserStatus.asOptions()               // → [{ value, label }, ...]
 */

const CASES = Object.freeze({
  ACTIVE:           'active',
  INACTIVE:         'inactive',
  PENDING_APPROVAL: 'pending_approval',
  SUSPENDED:        'suspended',
})

const LABELS = Object.freeze({
  [CASES.ACTIVE]:           'Active',
  [CASES.INACTIVE]:         'Inactive',
  [CASES.PENDING_APPROVAL]: 'Pending Approval',
  [CASES.SUSPENDED]:        'Suspended',
})

const BADGE_VARIANTS = Object.freeze({
  [CASES.ACTIVE]:           'default',
  [CASES.INACTIVE]:         'outline',
  [CASES.PENDING_APPROVAL]: 'secondary',
  [CASES.SUSPENDED]:        'destructive',
})

export const UserStatus = Object.freeze({
  ...CASES,

  /** Display label — mirrors UserStatus::label() */
  label: (value) => LABELS[value?.toLowerCase()] ?? value,

  /** Shadcn Badge variant for a given status */
  badgeVariant: (value) => BADGE_VARIANTS[value?.toLowerCase()] ?? 'outline',

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * Whether a user at this status can be approved (moved to active).
   * Mirrors the canApprove guard used across member/user tables.
   */
  canApprove: (value) =>
    value === CASES.PENDING_APPROVAL || value === 'pending',

  /** Whether a user at this status can be suspended */
  canSuspend: (value) => value === CASES.ACTIVE,

  /**
   * Options array for use in Select / dropdown components.
   * Mirrors UserStatus::asOptions() on the back end.
   */
  asOptions: (withAll = false) => {
    const opts = Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] }))
    return withAll ? [{ value: null, label: 'All Statuses' }, ...opts] : opts
  },

  /** Human-readable message per status — mirrors UserStatus::getMessage() */
  getMessage: (value) => {
    const messages = {
      [CASES.ACTIVE]:           'Your account is active',
      [CASES.INACTIVE]:         'Your account is inactive. Please contact support.',
      [CASES.PENDING_APPROVAL]: 'Your account is pending approval. Please wait for admin approval.',
      [CASES.SUSPENDED]:        'Your account has been suspended. Please contact support.',
    }
    return messages[value] ?? ''
  },
})
