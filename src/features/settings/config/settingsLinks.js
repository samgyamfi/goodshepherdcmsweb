import { Shield, Tag, Globe, HandCoins, Users, Wallet } from 'lucide-vue-next'

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
