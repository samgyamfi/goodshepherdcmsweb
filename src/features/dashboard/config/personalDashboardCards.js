import {
  Wallet,
  Heart,
  CalendarCheck,
  Users,
} from 'lucide-vue-next'

/**
 * Personal dashboard statistics cards configuration
 * Shows the authenticated user's personal stats
 */
export const personalDashboardCards = [
  {
    id: 'my-tithes-this-month',
    label: 'My Tithes This Month',
    value: 'GH₵ 0',
    icon: Wallet,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    apiEndpoint: '/api/payments/tithes/personal/monthly',
  },
  {
    id: 'my-welfare-this-month',
    label: 'My Welfare This Month',
    value: 'GH₵ 0',
    icon: Heart,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950',
    apiEndpoint: '/api/payments/welfare/personal/monthly',
  },
  {
    id: 'my-attendance-6-months',
    label: 'My Attendance (6 months)',
    value: '0',
    icon: CalendarCheck,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    apiEndpoint: '/api/attendance/personal/six-months',
  },
  {
    id: 'my-groups',
    label: 'My Groups',
    value: '0',
    icon: Users,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    apiEndpoint: '/api/groups/personal',
  },
]
