import { Shield, Tag, Globe, HandCoins, Users, Wallet, FileText, UserRound, CalendarDays, Calendar } from 'lucide-vue-next'

/**
 * Settings submenu links configuration
 */
export const settingsLinks = [
  {
    id: 'roles',
    name: 'Roles & Permissions',
    path: '/dashboard/settings/roles',
    icon: Shield,
    description: 'Manage user roles and access control',
  },
  {
    id: 'transaction-types',
    name: 'Transaction Types',
    path: '/dashboard/settings/transaction-types',
    icon: Tag,
    description: 'Configure transaction categories',
  },
  {
    id: 'groups',
    name: 'Groups',
    path: '/dashboard/settings/groups',
    icon: Users,
    description: 'Manage church groups',
  },
  {
    id: 'countries',
    name: 'Countries & Languages',
    path: '/dashboard/settings/countries',
    icon: Globe,
    description: 'Configure localization settings',
  },
  {
    id: 'content-management',
    name: 'Content Management',
    path: '/dashboard/settings/content-management',
    icon: FileText,
    description: 'Manage church landing page content',
    roles: ['super-admin', 'church-admin'], // Only admins
  },
  {
    id: 'pastors',
    name: 'Pastors Management',
    path: '/dashboard/settings/pastors',
    icon: UserRound,
    description: 'Manage church pastors and clergy',
    roles: ['super-admin', 'church-admin'], // Only admins
  },
  {
    id: 'programs',
    name: 'Programs Management',
    path: '/dashboard/settings/programs',
    icon: Calendar,
    description: 'Manage church programs and activities',
    roles: ['super-admin', 'church-admin'], // Only admins
  },
  {
    id: 'events',
    name: 'Events Management',
    path: '/dashboard/settings/events',
    icon: CalendarDays,
    description: 'Manage church events and special services',
    roles: ['super-admin', 'church-admin'], // Only admins
  },
  {
    id: 'welfare-settings',
    name: 'Welfare Settings',
    path: '/dashboard/settings/welfare-settings',
    icon: HandCoins,
    description: 'Configure welfare settings',
  },
  {
    id: 'donation-categories',
    name: 'Donation Categories',
    path: '/dashboard/settings/donation-categories',
    icon: HandCoins,
    description: 'Configure donation categories',
  },
  {
    id: 'expense-categories',
    name: 'Expense Categories',
    path: '/dashboard/settings/expense-categories',
    icon: Wallet,
    description: 'Configure expense categories',
  },
]
