import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  ArrowLeftRight,
  ScrollText,
  Layers3,
  MapPinned,
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
      { id: 'groups', name: 'Group Administration', path: '/admin/groups', icon: Layers3 },
      { id: 'geography', name: 'Geography', path: '/admin/geography', icon: MapPinned },
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
      { id: 'audit-logs', name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
      { id: 'settings', name: 'System Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]
