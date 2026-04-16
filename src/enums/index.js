/**
 * Central enum barrel — mirrors the PHP Backed Enums in app/Enums/.
 *
 * Import from here to keep all enum references consistent:
 *
 *   import { UserType, UserStatus, MembershipStatus } from '@/enums'
 *
 * Each enum exposes:
 *   - Frozen case constants   (e.g. UserType.SUPER_ADMIN → 'super_admin')
 *   - label(value)            — human-readable display string
 *   - badgeVariant(value)     — Shadcn Badge variant string
 *   - values()                — all raw values as an array
 *   - asOptions([withAll])    — [{ value, label }] array for Select components
 *   - domain-specific helpers (e.g. UserType.adminTypes(), UserStatus.canApprove())
 */

export { UserType }               from './UserType'
export { UserStatus }             from './UserStatus'
export { MembershipStatus }       from './MembershipStatus'
export { TransferRequestStatus }  from './TransferRequestStatus'
export { GroupMemberStatus }      from './GroupMemberStatus'
export { GroupLeaderRole }        from './GroupLeaderRole'
