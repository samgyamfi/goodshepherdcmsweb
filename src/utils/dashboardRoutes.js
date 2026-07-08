import { UserType } from '@/enums'

const DASHBOARD_BASES = Object.freeze({
  [UserType.SUPER_ADMIN]: '/super-admin/dashboard',
  [UserType.CHURCH_ADMIN]: '/church-admin/dashboard',
  [UserType.PASTOR]: '/pastor/dashboard',
  [UserType.MEMBER]: '/member/dashboard',
  [UserType.VISITOR]: '/visitor/dashboard',
})

const DASHBOARD_ROUTE_NAMES = Object.freeze({
  [UserType.SUPER_ADMIN]: 'super-admin-dashboard',
  [UserType.CHURCH_ADMIN]: 'church-admin-dashboard',
  [UserType.PASTOR]: 'pastor-dashboard',
  [UserType.MEMBER]: 'member-dashboard',
  [UserType.VISITOR]: 'visitor-dashboard',
})

export function dashboardBaseForUserType(userType) {
  return DASHBOARD_BASES[userType] ?? DASHBOARD_BASES[UserType.MEMBER]
}

export function dashboardRouteNameForUserType(userType) {
  return DASHBOARD_ROUTE_NAMES[userType] ?? DASHBOARD_ROUTE_NAMES[UserType.MEMBER]
}

export function typedDashboardPath(userType, dashboardPath = '/dashboard') {
  const base = dashboardBaseForUserType(userType)
  const suffix = dashboardPath.replace(/^\/dashboard/, '')

  return `${base}${suffix}`
}

export function isDashboardPath(path) {
  return path === '/dashboard'
    || path.startsWith('/dashboard/')
    || Object.values(DASHBOARD_BASES).some((base) => path === base || path.startsWith(`${base}/`))
}

export function requiresChurchContext(path) {
  const superAdminBase = DASHBOARD_BASES[UserType.SUPER_ADMIN]

  return isDashboardPath(path)
    && path !== superAdminBase
    && !path.startsWith(`${superAdminBase}/`)
}
