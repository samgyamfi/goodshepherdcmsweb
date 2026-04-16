/**
 * Mirrors App\Enums\UserType (PHP Backed Enum).
 *
 * Usage:
 *   import { UserType } from '@/enums'
 *
 *   UserType.SUPER_ADMIN                        // → 'super_admin'
 *   UserType.label('super_admin')               // → 'Super Administrator'
 *   UserType.badgeVariant('church_admin')       // → 'default'
 *   UserType.adminTypes()                       // → ['super_admin', 'church_admin']
 *   UserType.canSeeChurchDashboard('pastor')    // → false
 *   UserType.asOptions()                        // → [{ value, label }, ...]
 */

const CASES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  CHURCH_ADMIN: 'church_admin',
  PASTOR: 'pastor',
  MEMBER: 'member',
  VISITOR: 'visitor',
})

const LABELS = Object.freeze({
  [CASES.SUPER_ADMIN]: 'Super Administrator',
  [CASES.CHURCH_ADMIN]: 'Church Administrator',
  [CASES.PASTOR]: 'Pastor',
  [CASES.MEMBER]: 'Member',
  [CASES.VISITOR]: 'Visitor',
})

/** Shadcn badge variants keyed by user type */
const BADGE_VARIANTS = Object.freeze({
  [CASES.SUPER_ADMIN]: 'destructive',
  [CASES.CHURCH_ADMIN]: 'default',
  [CASES.PASTOR]: 'secondary',
  [CASES.MEMBER]: 'outline',
  [CASES.VISITOR]: 'outline',
})

export const UserType = Object.freeze({
  ...CASES,

  /** Display label — mirrors UserType::label() */
  label: (value) => LABELS[value] ?? value,

  /** Shadcn Badge variant for a given user type */
  badgeVariant: (value) => BADGE_VARIANTS[value] ?? 'outline',

  /** All values as a plain array */
  values: () => Object.values(CASES),

  /**
   * User types that are considered administrative.
   * Mirrors UserType::adminTypes().
   */
  adminTypes: () => [CASES.SUPER_ADMIN, CASES.CHURCH_ADMIN, CASES.PASTOR],

  /**
   * Whether a user type can see the Church Dashboard tab.
   * Mirrors the back-end gate that protects church-scoped views.
   */
  canSeeChurchDashboard: (value) =>
    [CASES.SUPER_ADMIN, CASES.CHURCH_ADMIN, CASES.PASTOR].includes(value),

  /**
   * Whether a user type can manage church-wide content.
   * Mirrors UserType::canManageContent().
   */
  canManageContent: (value) =>
    [CASES.SUPER_ADMIN, CASES.CHURCH_ADMIN, CASES.PASTOR].includes(value),

  /**
   * Whether a user type can manage churches at the system level.
   * Mirrors UserType::canManageChurches().
   */
  canManageChurches: (value) => value === CASES.SUPER_ADMIN,

  /**
   * Options array for use in Select / dropdown components.
   * Mirrors UserType::asOptions() on the back end.
   */
  asOptions: () => Object.values(CASES).map((v) => ({ value: v, label: LABELS[v] })),
})
