<script setup>
import { provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import GroupWorkspaceHeader from './components/workspace/GroupWorkspaceHeader.vue'
import GroupWorkspaceNav from './components/workspace/GroupWorkspaceNav.vue'
import { groupsService } from './services/groupsService'

const route = useRoute()
const router = useRouter()
const group = ref(null)
const loading = ref(true)

provide('groupWorkspace', group)

async function loadGroup() {
  loading.value = true
  try {
    const response = await groupsService.get(route.params.uuid)
    group.value = response.data.data.group
  } finally {
    loading.value = false
  }
}

watch(() => route.params.uuid, loadGroup, { immediate: true })
</script>

<template>
  <DashboardLayout>
    <div v-if="loading" class="space-y-4">
      <div class="h-14 animate-pulse rounded-md bg-muted" />
      <div class="h-10 animate-pulse rounded-md bg-muted" />
      <div class="h-96 animate-pulse rounded-md bg-muted" />
    </div>
    <div v-else-if="group" class="space-y-4">
      <GroupWorkspaceHeader :group="group" @back="router.push({ name: 'groups' })" />
      <GroupWorkspaceNav :uuid="group.uuid" :capabilities="group.capabilities" />
      <div
        v-if="group.is_archived"
        class="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm"
      >
        This group is archived. Its history remains available, but changes are disabled until an
        authorized administrator restores it.
      </div>
      <RouterView :group="group" />
    </div>
  </DashboardLayout>
</template>
