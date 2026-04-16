/**
 * Mirrors App\Enums\GroupLeaderRole (PHP Backed Enum).
 *
 * Usage:
 *   import { GroupLeaderRole } from '@/enums'
 *
 *   GroupLeaderRole.LEADER                  // → 'leader'
 *   GroupLeaderRole.label('coordinator')    // → 'Coordinator'
 *   GroupLeaderRole.asOptions()             // → [{ value, label }, ...]
 */

const CASES = Object.freeze({
  LEADER:      'leader',
  COORDINATOR: 'coordinator',
  ASSISTANT:   'assistant',
})

const LABELS = Object.freeze({
  [CASES.LEADER]:      'Leader',
  [CASES.COORDINATOR]: 'Coordinator',
  [CASES.ASSISTANT]:   'Assistant',
})

export const GroupLeaderRole = Object.freeze({
  ...CASES,

  /** Display label — mirrors GroupLeaderRole::label() */
  label: (value) => LABELS[value?.toLowerCase()] ?? value,

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * Options array for Select / dropdown components.
   * Mirrors GroupLeaderRole::asOptions() on the back end.
   */
  asOptions: (withAll = false) => {
    const opts = Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] }))
    return withAll ? [{ value: null, label: 'All Roles' }, ...opts] : opts
  },
})
