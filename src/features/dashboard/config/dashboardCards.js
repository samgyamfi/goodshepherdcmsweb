import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Heart,
} from 'lucide-vue-next'

/**
 * Dashboard statistics cards configuration
 */
export const dashboardCards = [
  {
    id: 'total-members',
    label: 'Total Members',
    value: '1,247',
    icon: Users,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'active-members',
    label: 'Active Members',
    value: '1,089',
    icon: UserCheck,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    id: 'attendance-this-week',
    label: "This Week's Attendance",
    value: '876',
    icon: CalendarCheck,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'tithes-this-month',
    label: "This Month's Tithes",
    value: 'GH₵ 45,230',
    icon: DollarSign,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
  },
  {
    id: 'offerings-this-month',
    label: "This Month's Offerings",
    value: 'GH₵ 18,450',
    icon: TrendingUp,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    id: 'welfare-contributions',
    label: 'Welfare This Month',
    value: 'GH₵ 12,800',
    icon: Heart,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950',
  },
]
