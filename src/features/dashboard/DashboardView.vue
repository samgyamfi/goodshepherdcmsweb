<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { showToast } from '@/utils/toast'
import { formatDateRange } from '@/utils/dateHelpers'
import { useDashboardTabs } from './composables/useDashboardTabs'
import DashboardLayout from './components/DashboardLayout.vue'
import StatsCard from './components/StatsCard.vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Calendar as CalendarIcon, FileText, User, Building, Wallet } from 'lucide-vue-next'
import { dashboardCards } from './config/dashboardCards'
import { personalDashboardCards } from './config/personalDashboardCards'

const authStore = useAuthStore()
const { activeTab, setActiveTab } = useDashboardTabs()

const dateRange = ref({
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  to: new Date(),
})

// Show welcome toast on mount
onMounted(() => {
  // Show welcome toast only once after login
  const hasShownWelcome = sessionStorage.getItem('welcome_shown')

  if (!hasShownWelcome && authStore.isAuthenticated) {
    showToast.success(`Welcome back, ${authStore.fullName}!`)
    sessionStorage.setItem('welcome_shown', 'true')
  }
})
</script>

<template>
  <DashboardLayout>
    <!-- Tabs Navigation -->
    <TabsRoot v-model="activeTab" class="mb-8">
      <TabsList class="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="personal" @click="setActiveTab('personal')">
          <User class="mr-2 h-4 w-4" />
          My Dashboard
        </TabsTrigger>
        <TabsTrigger value="admin" @click="setActiveTab('admin')">
          <Building class="mr-2 h-4 w-4" />
          Church Dashboard
        </TabsTrigger>
      </TabsList>

      <!-- Personal Dashboard Tab -->
      <TabsContent value="personal" class="mt-6">
        <!-- Welcome Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-foreground mb-2">
            Welcome back, {{ authStore.fullName }}! 👋
          </h1>
          <p class="text-muted-foreground">
            Here's an overview of your personal church activity
          </p>
        </div>

        <!-- Personal Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            v-for="card in personalDashboardCards"
            :key="card.id"
            :label="card.label"
            :value="card.value"
            :icon="card.icon"
            :icon-color="card.iconColor"
            :bg-color="card.bgColor"
          />
        </div>

        <!-- Recent Personal Activity -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Recent Payments -->
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-4">My Recent Payments</h3>
            <div class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p class="font-medium">Tithe Payment</p>
                  <p class="text-sm text-muted-foreground">March 1, 2026</p>
                </div>
                <span class="font-semibold text-green-600">GH₵ 500</span>
              </div>
              <div
                v-if="false"
                class="text-center text-muted-foreground py-4"
              >
                No recent payments
              </div>
            </div>
          </div>

          <!-- Recent Attendance -->
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-4">My Recent Attendance</h3>
            <div class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p class="font-medium">Sunday Service</p>
                  <p class="text-sm text-muted-foreground">March 1, 2026</p>
                </div>
                <span class="text-green-600">✓ Present</span>
              </div>
              <div
                v-if="false"
                class="text-center text-muted-foreground py-4"
              >
                No recent attendance records
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
          <div class="flex flex-wrap gap-4">
            <Button variant="default">
              <Wallet class="mr-2 h-4 w-4" />
              Make a Payment
            </Button>
            <Button variant="outline">
              <CalendarIcon class="mr-2 h-4 w-4" />
              View My Schedule
            </Button>
            <Button variant="outline">
              <FileText class="mr-2 h-4 w-4" />
              My Contribution Statement
            </Button>
          </div>
        </div>
      </TabsContent>

      <!-- Admin Dashboard Tab -->
      <TabsContent value="admin" class="mt-6">
        <!-- Welcome Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-foreground mb-2">
            Church Dashboard 📊
          </h1>
          <p class="text-muted-foreground">
            Church-wide statistics and analytics
          </p>
        </div>

        <!-- Filters and Actions -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <!-- Date Range Picker -->
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" class="w-[280px] justify-start text-left font-normal">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ formatDateRange(dateRange) }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="dateRange" mode="range" />
            </PopoverContent>
          </Popover>

          <div class="flex-1" />

          <Button variant="default">
            <FileText class="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatsCard
            v-for="card in dashboardCards"
            :key="card.id"
            :label="card.label"
            :value="card.value"
            :icon="card.icon"
            :icon-color="card.iconColor"
            :bg-color="card.bgColor"
          />
        </div>

        <!-- Chart Placeholders -->
        <div class="grid gap-6 md:grid-cols-2 mb-8">
          <!-- Attendance Trends -->
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-2">Attendance Trends</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Weekly service attendance over the past 6 months
            </p>
            <div class="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p class="text-muted-foreground">Line Chart Placeholder</p>
            </div>
          </div>

          <!-- Financial Overview -->
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-2">Financial Overview</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Monthly income breakdown by category
            </p>
            <div class="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p class="text-muted-foreground">Bar Chart Placeholder</p>
            </div>
          </div>
        </div>

        <!-- More Chart Placeholders -->
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-2">Member Growth</h3>
            <p class="text-sm text-muted-foreground mb-4">
              New members joined over the past year
            </p>
            <div class="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
              <p class="text-muted-foreground">Line Chart Placeholder</p>
            </div>
          </div>

          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-2">Service Attendance</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Distribution across Sunday services
            </p>
            <div class="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
              <p class="text-muted-foreground">Pie Chart Placeholder</p>
            </div>
          </div>

          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-lg font-semibold mb-2">Ministry Participation</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Active members in each ministry
            </p>
            <div class="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
              <p class="text-muted-foreground">Bar Chart Placeholder</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </TabsRoot>
  </DashboardLayout>
</template>
