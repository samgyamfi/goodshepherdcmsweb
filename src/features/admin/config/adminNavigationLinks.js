import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  ArrowLeftRight,
} from 'lucide-vue-next'

/**
 * Navigation sections for the super-admin system dashboard.
 * Each section groups related links with a label.
 */
export const adminNavigationSections = [
  {
    id: 'overview',
    label: 'Overview',
    links: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/admin',
        icon: LayoutDashboard,
        exact: true, // only highlight when path is exactly /admin
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform Management',
    links: [
      { id: 'churches', name: 'Churches', path: '/admin/churches', icon: Building2 },
      { id: 'users', name: 'Users', path: '/admin/users', icon: Users },
      {
        id: 'transfers',
        name: 'Transfer Requests',
        path: '/admin/transfers',
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    links: [
      { id: 'roles', name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
      { id: 'settings', name: 'System Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]
