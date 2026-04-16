import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

// Import feature routes
import landingRoutes from '@/features/landing/routes'
import authRoutes from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import membersRoutes from '@/features/members/routes'
import attendanceRoutes from '@/features/attendance/routes'
import welfareRoutes from '@/features/welfare/routes'
import tithesRoutes from '@/features/tithes/routes'
import eventsRoutes from '@/features/events/routes'
import groupsRoutes from '@/features/groups/routes'
import ministriesRoutes from '@/features/ministries/routes'
import sermonsRoutes from '@/features/sermons/routes'
import settingsRoutes from '@/features/settings/routes'
import errorRoutes from '@/features/errors/routes'
import churchRoutes from '@/features/church/routes'
import adminRoutes from '@/features/admin/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // Smooth scroll to hash links
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return savedPosition || { top: 0 }
  },

  routes: [
    ...landingRoutes,
    ...authRoutes,
    ...dashboardRoutes,
    ...membersRoutes,
    ...attendanceRoutes,
    ...welfareRoutes,
    ...tithesRoutes,
    ...eventsRoutes,
    ...groupsRoutes,
    ...ministriesRoutes,
    ...sermonsRoutes,
    ...settingsRoutes,
    ...churchRoutes,
    ...adminRoutes,
    ...errorRoutes,
  ],
})

// Apply navigation guards
router.beforeEach(authGuard)

export default router
