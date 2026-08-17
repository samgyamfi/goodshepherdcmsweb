<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Megaphone,
  NotebookText,
  UsersRound,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { groupsService } from '../../services/groupsService'
import { useNameGradient } from '@/composables/useNameGradient'

const props = defineProps({
  uuid: { type: String, required: true },
})

const loading = ref(true)
const data = ref(null)
const sloganIndex = ref(0)
const group = computed(() => data.value?.group)
const { gradientFor, initialsFor } = useNameGradient()
const initials = computed(() => initialsFor(group.value?.name))
const gradient = computed(() => gradientFor(group.value?.name))
const slogans = computed(() => group.value?.slogans ?? [])
const currentSlogan = computed(() => slogans.value[sloganIndex.value])

function moveSlogan(direction) {
  const total = slogans.value.length
  if (!total) return
  sloganIndex.value = (sloganIndex.value + direction + total) % total
}

async function load() {
  loading.value = true
  try {
    const response = await groupsService.wall(props.uuid)
    data.value = response.data.data
    sloganIndex.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.uuid, load)
</script>

<template>
  <div v-if="loading" class="h-[32rem] animate-pulse rounded-md bg-muted" />
  <div v-else-if="group" class="space-y-10 pb-10">
    <section class="relative -mx-4 min-h-[26rem] overflow-hidden sm:mx-0 sm:rounded-md">
      <div class="absolute inset-0" :style="{ background: gradient }" />
      <img
        v-if="group.banner_url"
        :src="group.banner_url"
        :alt="`${group.name} banner`"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black/50" />

      <div class="relative flex min-h-[26rem] flex-col justify-end px-5 py-8 text-white sm:px-10">
        <div
          class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border-4 border-white/70 bg-black/30 text-2xl font-bold backdrop-blur"
        >
          <img
            v-if="group.logo_url"
            :src="group.logo_url"
            :alt="`${group.name} logo`"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>
        <Badge class="mt-5 w-fit bg-white/15 text-white hover:bg-white/15">
          {{ group.category?.name || 'Church community' }}
        </Badge>
        <h1 class="mt-3 max-w-4xl text-3xl font-bold sm:text-5xl">{{ group.name }}</h1>
        <p v-if="group.motto" class="mt-3 max-w-3xl text-lg text-white/85 sm:text-xl">
          {{ group.motto }}
        </p>
        <div class="mt-6 flex items-center gap-4 text-sm text-white/80">
          <span class="flex items-center gap-1.5">
            <UsersRound class="h-4 w-4" /> {{ group.members_count }} members
          </span>
          <span v-if="group.membership?.title || group.membership?.member_role_label">
            {{ group.membership?.title || group.membership?.member_role_label }}
          </span>
        </div>
      </div>
    </section>

    <section
      v-if="currentSlogan"
      class="grid gap-5 border-y py-8 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div>
        <p class="text-xs font-semibold uppercase text-primary">Our charge</p>
        <div
          class="prose mt-3 max-w-3xl text-lg dark:prose-invert sm:text-xl"
          v-html="currentSlogan.content"
        />
      </div>
      <div v-if="slogans.length > 1" class="flex items-center gap-2">
        <Button size="icon" variant="outline" title="Previous slogan" @click="moveSlogan(-1)">
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <span class="min-w-12 text-center text-xs text-muted-foreground">
          {{ sloganIndex + 1 }} / {{ slogans.length }}
        </span>
        <Button size="icon" variant="outline" title="Next slogan" @click="moveSlogan(1)">
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </section>

    <section v-if="group.wall_content" class="max-w-4xl">
      <p class="text-xs font-semibold uppercase text-primary">About us</p>
      <div
        class="prose mt-4 max-w-none dark:prose-invert"
        v-html="group.wall_content"
      />
    </section>

    <section class="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
      <div>
        <div class="mb-4 flex items-center gap-2">
          <Megaphone class="h-5 w-5 text-primary" />
          <h2 class="text-xl font-semibold">Latest announcements</h2>
        </div>
        <div class="divide-y border-y">
          <article v-for="item in data.announcements" :key="item.uuid" class="py-5">
            <div class="flex items-start justify-between gap-3">
              <h3 class="font-semibold">{{ item.title }}</h3>
              <Badge v-if="item.is_pinned" variant="outline">Pinned</Badge>
            </div>
            <div class="prose prose-sm mt-2 max-w-none dark:prose-invert" v-html="item.body" />
          </article>
          <p v-if="!data.announcements?.length" class="py-10 text-sm text-muted-foreground">
            No announcements have been published.
          </p>
        </div>
      </div>

      <aside>
        <div class="mb-4 flex items-center gap-2">
          <Clock3 class="h-5 w-5 text-primary" />
          <h2 class="text-xl font-semibold">Meeting rhythm</h2>
        </div>
        <div class="space-y-3">
          <article
            v-for="item in data.schedules"
            :key="item.uuid"
            class="rounded-md border p-4"
          >
            <p class="font-medium">{{ item.name }}</p>
            <p class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays class="h-4 w-4" />
              {{ item.day_of_week_label }} · {{ item.recurrence_type }} ·
              {{ item.starts_at_label }}
            </p>
            <p v-if="item.location" class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin class="h-4 w-4" /> {{ item.location }}
            </p>
          </article>
          <p v-if="!data.schedules?.length" class="text-sm text-muted-foreground">
            No recurring meetings are published.
          </p>
        </div>
      </aside>
    </section>

    <section class="grid gap-8 lg:grid-cols-2">
      <div>
        <div class="mb-4 flex items-center gap-2">
          <CalendarDays class="h-5 w-5 text-primary" />
          <h2 class="text-xl font-semibold">Upcoming events</h2>
        </div>
        <div class="divide-y border-y">
          <article v-for="item in data.events" :key="item.uuid" class="py-4">
            <p class="font-medium">{{ item.name }}</p>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ item.event_date_label }}<span v-if="item.event_time_label"> · {{ item.event_time_label }}</span>
            </p>
          </article>
          <p v-if="!data.events?.length" class="py-8 text-sm text-muted-foreground">
            No upcoming group events.
          </p>
        </div>
      </div>

      <div>
        <div class="mb-4 flex items-center gap-2">
          <NotebookText class="h-5 w-5 text-primary" />
          <h2 class="text-xl font-semibold">Recent minutes</h2>
        </div>
        <div class="divide-y border-y">
          <article v-for="item in data.minutes" :key="item.uuid" class="py-4">
            <p class="font-medium">{{ item.title }}</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ item.meeting_date_label }}</p>
          </article>
          <p v-if="!data.minutes?.length" class="py-8 text-sm text-muted-foreground">
            No meeting minutes have been published.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
