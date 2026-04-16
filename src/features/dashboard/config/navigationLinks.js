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
} from 'lucide-vue-next'

/**
 * Dashboard navigation links configuration
 * Each link can have role-based access control
 */
export const navigationLinks = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: [], // Empty = all authenticated users
  },
  {
    id: 'members',
    name: 'Members',
    path: '/dashboard/members',
    icon: Users,
    // roles: ['super-admin', 'admin', 'member-manager'],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    path: '/dashboard/attendance',
    icon: Calendar,
    roles: ['super-admin', 'admin', 'attendance-manager'],
  },
  {
    id: 'tithes',
    name: 'Tithes & Offerings',
    path: '/dashboard/tithes',
    icon: DollarSign,
    roles: ['super-admin', 'admin', 'finance-admin'],
  },
  {
    id: 'welfare',
    name: 'Welfare',
    path: '/dashboard/welfare',
    icon: Heart,
    roles: ['super-admin', 'admin', 'welfare-admin'],
  },
  {
    id: 'events',
    name: 'Events',
    path: '/dashboard/events',
    icon: CalendarDays,
    roles: ['super-admin', 'admin', 'event-manager'],
  },
  {
    id: 'groups',
    name: 'Small Groups',
    path: '/dashboard/groups',
    icon: UsersRound,
    roles: ['super-admin', 'admin', 'group-leader'],
  },
  {
    id: 'ministries',
    name: 'Ministries',
    path: '/dashboard/ministries',
    icon: Users2,
    roles: ['super-admin', 'admin'],
  },
  {
    id: 'sermons',
    name: 'Sermons',
    path: '/dashboard/sermons',
    icon: BookOpen,
    roles: ['super-admin', 'admin', 'media-manager'],
  },
  {
    id: 'church-transfers',
    name: 'Church Transfers',
    path: '/dashboard/church/transfers',
    icon: UserRound,
    roles: [], // All authenticated users
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    roles: ['super-admin', 'admin'],
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
    links: navigationLinks.slice(0, -1), // All except settings
  },
  {
    id: 'settings',
    label: 'Administration',
    links: navigationLinks.slice(-1), // Just settings
  },
]
