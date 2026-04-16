/**
 * Mirrors App\Enums\MembershipStatus (PHP Backed Enum).
 *
 * Usage:
 *   import { MembershipStatus } from '@/enums'
 *
 *   MembershipStatus.ACTIVE                  // → 'active'
 *   MembershipStatus.label('transferred')    // → 'Transferred'
 *   MembershipStatus.badgeVariant('visitor') // → 'secondary'
 *   MembershipStatus.asOptions()             // → [{ value, label }, ...]
 */

const CASES = Object.freeze({
  VISITOR:     'visitor',
  ACTIVE:      'active',
  INACTIVE:    'inactive',
  TRANSFERRED: 'transferred',
})

const LABELS = Object.freeze({
  [CASES.VISITOR]:     'Visitor',
  [CASES.ACTIVE]:      'Active',
  [CASES.INACTIVE]:    'Inactive',
  [CASES.TRANSFERRED]: 'Transferred',
})

const BADGE_VARIANTS = Object.freeze({
  [CASES.VISITOR]:     'secondary',
  [CASES.ACTIVE]:      'default',
  [CASES.INACTIVE]:    'outline',
  [CASES.TRANSFERRED]: 'secondary',
})

export const MembershipStatus = Object.freeze({
  ...CASES,

  /** Display label — mirrors MembershipStatus::label() */
  label: (value) => LABELS[value?.toLowerCase()] ?? value,

  /** Shadcn Badge variant for a given membership status */
  badgeVariant: (value) => BADGE_VARIANTS[value?.toLowerCase()] ?? 'outline',

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * Options array for Select / dropdown components.
   * Mirrors MembershipStatus::asOptions() on the back end.
   * @param {boolean} withAll - Prepend an "All" option
   */
  asOptions: (withAll = false) => {
    const opts = Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] }))
    return withAll ? [{ value: null, label: 'All Membership Statuses' }, ...opts] : opts
  },
})
