import {
  Bell,
  CalendarDays,
  Gauge,
  Image,
  Megaphone,
  NotebookText,
  PanelsTopLeft,
  Settings,
  UserRound,
  UsersRound,
} from 'lucide-vue-next'

export function workspaceNavigation(capabilities = {}) {
  return [
    { name: 'group-wall', label: 'Wall', icon: PanelsTopLeft, visible: true },
    {
      name: 'group-dashboard',
      label: 'Dashboard',
      icon: Gauge,
      visible: capabilities.view_dashboard,
    },
    {
      name: 'group-personal',
      label: 'My Space',
      icon: UserRound,
      visible: capabilities.view_personal,
    },
    { name: 'group-schedule', label: 'Schedule', icon: CalendarDays, visible: true },
    { name: 'group-events', label: 'Events', icon: CalendarDays, visible: true },
    {
      name: 'group-members',
      label: 'Members',
      icon: UsersRound,
      visible: capabilities.manage_members,
    },
    { name: 'group-announcements', label: 'Announcements', icon: Megaphone, visible: true },
    { name: 'group-minutes', label: 'Minutes', icon: NotebookText, visible: true },
    {
      name: 'group-notices',
      label: 'Notices',
      icon: Bell,
      visible: capabilities.view_personal,
    },
    {
      name: 'group-branding',
      label: 'Branding',
      icon: Image,
      visible: capabilities.manage_group,
    },
    {
      name: 'group-settings',
      label: 'Settings',
      icon: Settings,
      visible: capabilities.manage_group,
    },
  ].filter((item) => item.visible)
}
