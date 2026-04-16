/**
 * Mirrors App\Enums\GroupMemberStatus (PHP Backed Enum).
 *
 * Usage:
 *   import { GroupMemberStatus } from '@/enums'
 *
 *   GroupMemberStatus.ACTIVE              // → 'active'
 *   GroupMemberStatus.label('pending')    // → 'Pending'
 *   GroupMemberStatus.asOptions()         // → [{ value, label }, ...]
 */

const CASES = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  PENDING:  'pending',
})

const LABELS = Object.freeze({
  [CASES.ACTIVE]:   'Active',
  [CASES.INACTIVE]: 'Inactive',
  [CASES.PENDING]:  'Pending',
})

const BADGE_VARIANTS = Object.freeze({
  [CASES.ACTIVE]:   'default',
  [CASES.INACTIVE]: 'outline',
  [CASES.PENDING]:  'secondary',
})

export const GroupMemberStatus = Object.freeze({
  ...CASES,

  /** Display label — mirrors GroupMemberStatus::label() */
  label: (value) => LABELS[value?.toLowerCase()] ?? value,

  /** Shadcn Badge variant */
  badgeVariant: (value) => BADGE_VARIANTS[value?.toLowerCase()] ?? 'outline',

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * Options array for Select / dropdown components.
   * Mirrors GroupMemberStatus::asOptions() on the back end.
   */
  asOptions: (withAll = false) => {
    const opts = Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] }))
    return withAll ? [{ value: null, label: 'All Statuses' }, ...opts] : opts
  },
})
