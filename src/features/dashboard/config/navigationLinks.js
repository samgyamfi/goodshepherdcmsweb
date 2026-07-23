import {
  LayoutDashboard,
  Users,
  Heart,
  DollarSign,
  Settings,
  Calendar,
  CalendarDays,
  Users2,
  BookOpen,
  UsersRound,
  UserRound,
  ScrollText,
} from 'lucide-vue-next'

/**
 * Dashboard navigation links configuration.
 * Each link can have permission-based access control.
 */
export const navigationLinks = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    permissions: [],
  },
  {
    id: 'members',
    name: 'Members',
    path: '/dashboard/members',
    icon: Users,
    permissions: ['members.view_all'],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    path: '/dashboard/attendance',
    icon: Calendar,
    permissions: ['events.attendance'],
  },
  {
    id: 'tithes',
    name: 'Tithes & Offerings',
    path: '/dashboard/tithes',
    icon: DollarSign,
    permissions: ['dashboard.financial', 'transactions.view_all'],
  },
  {
    id: 'welfare',
    name: 'Welfare',
    path: '/dashboard/welfare',
    icon: Heart,
    permissions: ['welfare.payments.view'],
  },
  {
    id: 'events',
    name: 'Events',
    path: '/dashboard/events',
    icon: CalendarDays,
    permissions: ['events.view'],
  },
  {
    id: 'groups',
    name: 'Small Groups',
    path: '/dashboard/groups',
    icon: UsersRound,
    permissions: ['groups.view'],
  },
  {
    id: 'ministries',
    name: 'Ministries',
    path: '/dashboard/ministries',
    icon: Users2,
    permissions: ['groups.view'],
  },
  {
    id: 'sermons',
    name: 'Sermons',
    path: '/dashboard/sermons',
    icon: BookOpen,
    permissions: ['settings.view'],
  },
  {
    id: 'church-transfers',
    name: 'Church Transfers',
    path: '/dashboard/church/transfers',
    icon: UserRound,
    permissions: [],
  },
  {
    id: 'audit-logs',
    name: 'Audit Logs',
    path: '/dashboard/audit-logs',
    icon: ScrollText,
    permissions: ['audit.view'],
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    permissions: ['settings.view'],
  },
]

/**
 * Navigation sections with labels
 * Groups navigation links into logical sections
 */
export const navigationSections = [
  {
    id: 'main',
    label: 'Church Management',
    links: navigationLinks.slice(0, -2),
  },
  {
    id: 'settings',
    label: 'Administration',
    links: navigationLinks.slice(-2),
  },
]
