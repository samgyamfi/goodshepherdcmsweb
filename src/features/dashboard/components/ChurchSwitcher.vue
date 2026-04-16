<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChurchStore } from '@/stores/church'
import { showToast } from '@/utils/toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Church, Check } from 'lucide-vue-next'

const churchStore = useChurchStore()
const isOpen = ref(false)

const currentChurch = computed(() => churchStore.church)

onMounted(async () => {
  await churchStore.fetchUserProfiles()
})

async function switchChurch(profile) {
  if (profile.id === churchStore.currentChurchId) {
    return
  }

  const success = await churchStore.setActiveProfile(profile.id)
  
  if (success) {
    showToast.success(`Switched to ${profile.church.name}`)
    // Reload the page to refresh all data with new church context
    window.location.reload()
  } else {
    showToast.error('Failed to switch church')
  }
}
</script>

<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="w-full justify-start">
        <Church class="mr-2 h-4 w-4" />
        <span class="truncate flex-1">
          {{ currentChurch?.name || 'Select Church' }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[280px]">
      <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
        Your Churches
      </div>

      <DropdownMenuItem
        v-for="profile in churchStore.userProfiles"
        :key="profile.id"
        class="cursor-pointer"
        @click="switchChurch(profile)"
      >
        <Check
          v-if="profile.is_active"
          class="mr-2 h-4 w-4 text-primary"
        />
        <span v-else class="mr-2 w-4" />
        <div class="flex-1">
          <div class="font-medium">{{ profile.church.name }}</div>
          <div class="text-xs text-muted-foreground">
            {{ profile.church.city }}, {{ profile.church.region }}
          </div>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
