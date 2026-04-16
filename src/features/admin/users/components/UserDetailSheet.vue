<script setup>
import { ref, computed, watch } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  X,
  User,
  Building2,
  Users,
  Heart,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Briefcase,
  Crown,
  CheckCircle2,
  Shield,
  BookOpen,
  UserCheck,
  Star,
} from 'lucide-vue-next'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import { UserType, MembershipStatus } from '@/enums'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** Basic user object (from the list) — shown immediately while loading full details */
  user: { type: Object, default: null },
})

const emit = defineEmits(['update:open'])

const adminStore = useAdminDashboardStore()
const userDetail = ref(null)
const isLoading = ref(false)

// Fetch full details whenever the sheet opens (always use UUID, never numeric id)
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    if (!props.user?.uuid) return

    isLoading.value = true
    userDetail.value = null
    userDetail.value = await adminStore.fetchUserDetail(props.user.uuid)
    isLoading.value = false
  },
)

// Reset when a different user is selected
watch(
  () => props.user?.uuid,
  () => {
    userDetail.value = null
  },
)

// ── Derived display data ───────────────────────────────────────────────────────
const displayUser = computed(() => userDetail.value ?? props.user)

const initials = computed(() => {
  const u = displayUser.value
  if (!u) return '?'
  return ((u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')).toUpperCase() || 'U'
})

/** The currently-active profile (is_active = true) */
const activeProfile = computed(
  () =>
    userDetail.value?.profiles?.find((p) => p.is_active) ?? userDetail.value?.profiles?.[0] ?? null,
)

/** All group memberships across all profiles, deduplicated by group UUID */
const allGroupMemberships = computed(() => {
  if (!userDetail.value?.profiles) return []
  const seen = new Set()
  return userDetail.value.profiles
    .flatMap((p) =>
      (p.group_memberships ?? []).map((gm) => ({ ...gm, church_name: p.church_name })),
    )
    .filter((gm) => {
      if (seen.has(gm.uuid)) return false
      seen.add(gm.uuid)
      return true
    })
})

/** All leadership roles across all profiles */
const allLeadershipRoles = computed(() => {
  if (!userDetail.value?.profiles) return []
  return userDetail.value.profiles.flatMap((p) =>
    (p.leadership_roles ?? []).map((lr) => ({ ...lr, church_name: p.church_name })),
  )
})

// ── Helpers — delegate to enums, no raw strings ───────────────────────────────
function userTypeBadgeVariant(type) {
  return UserType.badgeVariant(type)
}

function membershipBadgeVariant(status) {
  return MembershipStatus.badgeVariant(status)
}

function fmt(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function age(dob) {
  if (!dob) return null
  const diff = new Date() - new Date(dob)
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000))
}

function capitalize(str) {
  if (!str) return '—'
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="w-[95vw] sm:w-[90vw] lg:w-[75vw] xl:w-[65vw] max-w-[1100px] p-0 flex flex-col overflow-hidden"
    >
      <!-- ── Sheet header ──────────────────────────────────────────────────── -->
      <SheetHeader class="px-6 py-4 border-b shrink-0">
        <div class="flex items-center justify-between gap-4">
          <SheetTitle class="text-base">User Details</SheetTitle>
          <SheetClose as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0">
              <X class="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <!-- ── Scrollable body ───────────────────────────────────────────────── -->
      <div class="flex-1 overflow-y-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="p-6 space-y-6">
          <div class="flex items-center gap-4">
            <Skeleton class="h-20 w-20 rounded-full" />
            <div class="space-y-2 flex-1">
              <Skeleton class="h-6 w-48" />
              <Skeleton class="h-4 w-32" />
              <Skeleton class="h-5 w-24" />
            </div>
          </div>
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-40 w-full" />
          <Skeleton class="h-40 w-full" />
        </div>

        <!-- Content -->
        <div v-else-if="displayUser" class="flex flex-col h-full">
          <!-- ── Profile hero ──────────────────────────────────────────────── -->
          <div class="px-6 py-5 bg-muted/30 border-b">
            <div class="flex items-start gap-5">
              <!-- Avatar -->
              <Avatar class="h-20 w-20 shrink-0 ring-2 ring-background shadow-md">
                <AvatarImage :src="displayUser.avatar" :alt="displayUser.full_name" />
                <AvatarFallback class="text-2xl font-bold bg-primary/10 text-primary">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>

              <!-- Identity -->
              <div class="flex-1 min-w-0 space-y-2">
                <div>
                  <h2 class="text-2xl font-bold truncate">{{ displayUser.full_name }}</h2>
                  <p class="text-sm text-muted-foreground font-mono">{{ displayUser.uuid }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <Badge :variant="userTypeBadgeVariant(displayUser.user_type)" class="capitalize">
                    <Shield class="h-3 w-3 mr-1" />
                    {{ displayUser.user_type_label ?? displayUser.user_type }}
                  </Badge>
                  <Badge v-if="displayUser.status" variant="outline" class="capitalize">
                    {{ displayUser.status }}
                  </Badge>
                  <Badge v-if="userDetail?.profiles?.length" variant="secondary">
                    <Building2 class="h-3 w-3 mr-1" />
                    {{ userDetail.profiles.length }} church{{
                      userDetail.profiles.length !== 1 ? 'es' : ''
                    }}
                  </Badge>
                </div>

                <!-- Quick contact -->
                <div class="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                  <span v-if="displayUser.email" class="flex items-center gap-1.5">
                    <Mail class="h-3.5 w-3.5" />
                    {{ displayUser.email }}
                  </span>
                  <span v-if="displayUser.phone" class="flex items-center gap-1.5">
                    <Phone class="h-3.5 w-3.5" />
                    {{ displayUser.phone }}
                  </span>
                  <span v-if="displayUser.created_at" class="flex items-center gap-1.5">
                    <Calendar class="h-3.5 w-3.5" />
                    Joined {{ fmt(displayUser.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Tabs ──────────────────────────────────────────────────────── -->
          <TabsRoot default-value="overview" class="flex-1 flex flex-col min-h-0">
            <div class="px-6 border-b bg-background">
              <TabsList class="h-10 bg-transparent gap-1 p-0 rounded-none">
                <TabsTrigger
                  v-for="tab in [
                    { value: 'overview', label: 'Overview', icon: User },
                    { value: 'churches', label: 'Churches', icon: Building2 },
                    { value: 'personal', label: 'Personal', icon: UserCheck },
                    { value: 'groups', label: 'Groups & Roles', icon: Users },
                    { value: 'spiritual', label: 'Spiritual', icon: Heart },
                  ]"
                  :key="tab.value"
                  :value="tab.value"
                  class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-10 px-3 text-sm"
                >
                  <component :is="tab.icon" class="h-3.5 w-3.5 mr-1.5" />
                  {{ tab.label }}
                </TabsTrigger>
              </TabsList>
            </div>

            <div class="flex-1 overflow-y-auto">
              <!-- ── Overview ─────────────────────────────────────────────── -->
              <TabsContent value="overview" class="p-6 space-y-5 mt-0">
                <!-- Account info -->
                <Card>
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm flex items-center gap-2">
                      <Shield class="h-4 w-4" /> Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">User Type</p>
                      <p class="font-medium capitalize">
                        {{ displayUser.user_type_label ?? displayUser.user_type }}
                      </p>
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">Account Status</p>
                      <p class="font-medium capitalize">{{ displayUser.status ?? '—' }}</p>
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">Email</p>
                      <p class="font-medium break-all">{{ displayUser.email ?? '—' }}</p>
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">Phone</p>
                      <p class="font-medium">{{ displayUser.phone ?? '—' }}</p>
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">Registered</p>
                      <p class="font-medium">{{ fmt(displayUser.created_at) }}</p>
                    </div>
                    <div v-if="displayUser.deleted_at" class="space-y-0.5">
                      <p class="text-xs text-muted-foreground">Deleted</p>
                      <p class="font-medium text-destructive">{{ fmt(displayUser.deleted_at) }}</p>
                    </div>
                  </CardContent>
                </Card>

                <!-- Active church snapshot -->
                <Card v-if="activeProfile">
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm flex items-center gap-2">
                      <Building2 class="h-4 w-4" /> Active Church
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-3 text-sm">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-base">{{ activeProfile.church_name }}</span>
                      <Badge
                        :variant="membershipBadgeVariant(activeProfile.membership_status)"
                        class="capitalize"
                      >
                        {{ capitalize(activeProfile.membership_status) }}
                      </Badge>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Membership Date</p>
                        <p>{{ fmt(activeProfile.membership_date) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Baptized</p>
                        <p>
                          {{
                            activeProfile.is_baptized
                              ? `Yes — ${fmt(activeProfile.baptism_date)}`
                              : 'Not on record'
                          }}
                        </p>
                      </div>
                      <div v-if="activeProfile.occupation" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Occupation</p>
                        <p>{{ activeProfile.occupation }}</p>
                      </div>
                      <div v-if="activeProfile.city" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">City</p>
                        <p>{{ activeProfile.city }}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <!-- Leadership & Groups summary -->
                <Card v-if="allLeadershipRoles.length > 0">
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm flex items-center gap-2">
                      <Crown class="h-4 w-4 text-amber-500" /> Leadership Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="flex flex-wrap gap-2">
                    <div
                      v-for="(role, i) in allLeadershipRoles"
                      :key="i"
                      class="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
                    >
                      <Star class="h-3 w-3" />
                      {{ capitalize(role.role) }} — {{ role.group_name }}
                      <span class="text-amber-500/70">({{ role.church_name }})</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <!-- ── Churches ─────────────────────────────────────────────── -->
              <TabsContent value="churches" class="p-6 space-y-4 mt-0">
                <template v-if="userDetail?.profiles?.length">
                  <div
                    v-for="profile in userDetail.profiles"
                    :key="profile.uuid"
                    class="rounded-xl border overflow-hidden"
                    :class="profile.is_active ? 'border-primary/40 ring-1 ring-primary/20' : ''"
                  >
                    <!-- Profile header -->
                    <div
                      class="flex items-center justify-between px-4 py-3"
                      :class="profile.is_active ? 'bg-primary/5' : 'bg-muted/30'"
                    >
                      <div class="flex items-center gap-2">
                        <Building2 class="h-4 w-4 text-muted-foreground" />
                        <span class="font-semibold">{{ profile.church_name }}</span>
                        <Badge v-if="profile.is_active" variant="default" class="text-xs h-5">
                          <CheckCircle2 class="h-3 w-3 mr-0.5" /> Active
                        </Badge>
                      </div>
                      <Badge
                        :variant="membershipBadgeVariant(profile.membership_status)"
                        class="capitalize text-xs"
                      >
                        {{ capitalize(profile.membership_status) }}
                      </Badge>
                    </div>

                    <!-- Profile body -->
                    <div class="px-4 py-3 grid sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Membership Date</p>
                        <p>{{ fmt(profile.membership_date) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Baptized</p>
                        <p>
                          {{ profile.is_baptized ? `Yes — ${fmt(profile.baptism_date)}` : '—' }}
                        </p>
                      </div>
                      <div v-if="profile.occupation" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Occupation</p>
                        <p>{{ profile.occupation }}</p>
                      </div>

                      <!-- Groups in this church -->
                      <div
                        v-if="profile.group_memberships?.length"
                        class="sm:col-span-3 space-y-1.5 pt-1"
                      >
                        <p class="text-xs text-muted-foreground font-medium">Groups</p>
                        <div class="flex flex-wrap gap-1.5">
                          <Badge
                            v-for="gm in profile.group_memberships"
                            :key="gm.uuid"
                            variant="secondary"
                            class="text-xs"
                          >
                            {{ gm.name }}
                          </Badge>
                        </div>
                      </div>

                      <!-- Leadership roles in this church -->
                      <div
                        v-if="profile.leadership_roles?.length"
                        class="sm:col-span-3 space-y-1.5 pt-1"
                      >
                        <p class="text-xs text-muted-foreground font-medium">Leadership</p>
                        <div class="flex flex-wrap gap-1.5">
                          <span
                            v-for="lr in profile.leadership_roles"
                            :key="lr.uuid"
                            class="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                          >
                            <Crown class="h-2.5 w-2.5" />
                            {{ capitalize(lr.role) }} — {{ lr.group_name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="py-10 text-center text-muted-foreground text-sm">
                  <Building2 class="h-10 w-10 mx-auto mb-2 opacity-20" />
                  No church profiles found
                </div>
              </TabsContent>

              <!-- ── Personal ──────────────────────────────────────────────── -->
              <TabsContent value="personal" class="p-6 space-y-5 mt-0">
                <p v-if="!activeProfile" class="text-sm text-muted-foreground">
                  No profile data available.
                </p>
                <template v-else>
                  <Card>
                    <CardHeader class="pb-3">
                      <CardTitle class="text-sm flex items-center gap-2">
                        <User class="h-4 w-4" /> Personal Details
                        <span class="text-xs font-normal text-muted-foreground"
                          >(from {{ activeProfile.church_name }})</span
                        >
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Date of Birth</p>
                        <p>{{ fmt(activeProfile.date_of_birth) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Age</p>
                        <p>
                          {{
                            age(activeProfile.date_of_birth)
                              ? `${age(activeProfile.date_of_birth)} years`
                              : '—'
                          }}
                        </p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Gender</p>
                        <p class="capitalize">{{ capitalize(activeProfile.gender) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Marital Status</p>
                        <p class="capitalize">{{ capitalize(activeProfile.marital_status) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Occupation</p>
                        <div class="flex items-center gap-1.5">
                          <Briefcase class="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{{ activeProfile.occupation ?? '—' }}</span>
                        </div>
                      </div>
                      <div v-if="activeProfile.whatsapp_number" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">WhatsApp</p>
                        <p>{{ activeProfile.whatsapp_number }}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card v-if="activeProfile.address || activeProfile.city">
                    <CardHeader class="pb-3">
                      <CardTitle class="text-sm flex items-center gap-2">
                        <MapPin class="h-4 w-4" /> Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div v-if="activeProfile.address" class="sm:col-span-2 space-y-0.5">
                        <p class="text-xs text-muted-foreground">Address</p>
                        <p>{{ activeProfile.address }}</p>
                      </div>
                      <div v-if="activeProfile.city" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">City</p>
                        <p>{{ activeProfile.city }}</p>
                      </div>
                      <div v-if="activeProfile.state" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">State / Region</p>
                        <p>{{ activeProfile.state }}</p>
                      </div>
                      <div v-if="activeProfile.postal_code" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Postal Code</p>
                        <p>{{ activeProfile.postal_code }}</p>
                      </div>
                    </CardContent>
                  </Card>
                </template>
              </TabsContent>

              <!-- ── Groups & Roles ─────────────────────────────────────────── -->
              <TabsContent value="groups" class="p-6 space-y-5 mt-0">
                <!-- Leadership roles -->
                <Card v-if="allLeadershipRoles.length > 0">
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm flex items-center gap-2">
                      <Crown class="h-4 w-4 text-amber-500" /> Leadership Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="divide-y">
                      <div
                        v-for="(lr, i) in allLeadershipRoles"
                        :key="i"
                        class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div>
                          <p class="font-medium text-sm">{{ lr.group_name }}</p>
                          <p class="text-xs text-muted-foreground">{{ lr.church_name }}</p>
                        </div>
                        <div class="text-right space-y-1">
                          <Badge variant="outline" class="capitalize text-xs">
                            {{ capitalize(lr.role) }}
                          </Badge>
                          <p v-if="lr.since" class="text-xs text-muted-foreground">
                            Since {{ fmt(lr.since) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <!-- Group memberships -->
                <Card>
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm flex items-center gap-2">
                      <Users class="h-4 w-4" /> Group Memberships
                    </CardTitle>
                  </CardHeader>
                  <CardContent v-if="allGroupMemberships.length > 0">
                    <div class="divide-y">
                      <div
                        v-for="(gm, i) in allGroupMemberships"
                        :key="i"
                        class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div>
                          <p class="font-medium text-sm">{{ gm.name }}</p>
                          <p class="text-xs text-muted-foreground">{{ gm.church_name }}</p>
                        </div>
                        <div class="text-right space-y-1">
                          <Badge v-if="gm.status" variant="secondary" class="capitalize text-xs">
                            {{ capitalize(gm.status) }}
                          </Badge>
                          <p v-if="gm.joined_at" class="text-xs text-muted-foreground">
                            Joined {{ fmt(gm.joined_at) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent v-else class="text-sm text-muted-foreground py-4">
                    Not a member of any groups yet.
                  </CardContent>
                </Card>
              </TabsContent>

              <!-- ── Spiritual ─────────────────────────────────────────────── -->
              <TabsContent value="spiritual" class="p-6 space-y-5 mt-0">
                <p v-if="!activeProfile" class="text-sm text-muted-foreground">
                  No profile data available.
                </p>
                <template v-else>
                  <Card>
                    <CardHeader class="pb-3">
                      <CardTitle class="text-sm flex items-center gap-2">
                        <Heart class="h-4 w-4" /> Faith & Membership
                        <span class="text-xs font-normal text-muted-foreground"
                          >({{ activeProfile.church_name }})</span
                        >
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Baptism</p>
                        <div class="flex items-center gap-1.5">
                          <UserCheck class="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{{
                            activeProfile.is_baptized ? 'Baptized' : 'Not on record'
                          }}</span>
                        </div>
                      </div>
                      <div
                        v-if="activeProfile.is_baptized && activeProfile.baptism_date"
                        class="space-y-0.5"
                      >
                        <p class="text-xs text-muted-foreground">Baptism Date</p>
                        <p>{{ fmt(activeProfile.baptism_date) }}</p>
                      </div>
                      <div v-if="activeProfile.membership_date" class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Membership Date</p>
                        <p>{{ fmt(activeProfile.membership_date) }}</p>
                      </div>
                      <div class="space-y-0.5">
                        <p class="text-xs text-muted-foreground">Contact Privacy</p>
                        <p>
                          {{
                            activeProfile.privacy_share_contact
                              ? 'Contact info shared'
                              : 'Contact info private'
                          }}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    v-if="
                      activeProfile.spiritual_gifts ||
                      activeProfile.ministry_interests ||
                      activeProfile.prayer_requests
                    "
                  >
                    <CardHeader class="pb-3">
                      <CardTitle class="text-sm flex items-center gap-2">
                        <BookOpen class="h-4 w-4" /> Spiritual Life
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-5 text-sm">
                      <div v-if="activeProfile.spiritual_gifts" class="space-y-1.5">
                        <p
                          class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                        >
                          Spiritual Gifts
                        </p>
                        <p class="leading-relaxed">{{ activeProfile.spiritual_gifts }}</p>
                      </div>
                      <Separator
                        v-if="activeProfile.spiritual_gifts && activeProfile.ministry_interests"
                      />
                      <div v-if="activeProfile.ministry_interests" class="space-y-1.5">
                        <p
                          class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                        >
                          Ministry Interests
                        </p>
                        <p class="leading-relaxed">{{ activeProfile.ministry_interests }}</p>
                      </div>
                      <Separator
                        v-if="activeProfile.ministry_interests && activeProfile.prayer_requests"
                      />
                      <div v-if="activeProfile.prayer_requests" class="space-y-1.5">
                        <p
                          class="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
                        >
                          <MessageSquare class="h-3.5 w-3.5" /> Prayer Requests
                        </p>
                        <p class="leading-relaxed text-muted-foreground italic">
                          {{ activeProfile.prayer_requests }}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </template>
              </TabsContent>
            </div>
          </TabsRoot>
        </div>

        <!-- No user data -->
        <div v-else class="flex items-center justify-center h-full min-h-[200px]">
          <p class="text-muted-foreground text-sm">User information could not be loaded.</p>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
