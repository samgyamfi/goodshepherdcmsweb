<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Pencil, X } from 'lucide-vue-next'

// Detail components
import MemberProfileCard from './components/details/MemberProfileCard.vue'
import MemberPersonalInfo from './components/details/MemberPersonalInfo.vue'
import MemberLocationInfo from './components/details/MemberLocationInfo.vue'
import MemberSpiritualInfo from './components/details/MemberSpiritualInfo.vue'
import MemberGroupsList from './components/details/MemberGroupsList.vue'

const props = defineProps({
  member: {
    type: Object,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'edit'])

const displayMember = computed(() => {
  if (!props.member) return null

  const profile = props.member.profile ?? {}
  const personalInfo = profile.personal_info ?? props.member.personal_info ?? {}
  const spiritualInfo = profile.spiritual_info ?? props.member.spiritual_info ?? {}

  return {
    ...props.member,
    ...personalInfo,
    ...profile,
    ...spiritualInfo,
    country: profile.country?.name ?? profile.country_name ?? props.member.country,
    region: profile.region_reference?.name ?? null,
    city: profile.city_reference?.name ?? null,
    postal_code: profile.postal_code_reference?.name ?? null,
    privacy_share_contact:
      profile.privacy_share_contact ?? props.member.privacy_share_contact ?? false,
  }
})

/**
 * Handle edit click
 */
function handleEdit() {
  emit('edit', props.member)
}

/**
 * Handle close
 */
function handleClose() {
  emit('close')
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="handleClose">
    <SheetContent
      side="right"
      class="w-[96vw] sm:w-[92vw] lg:w-[86vw] xl:w-[85vw] 2xl:w-[75vw] p-0 flex flex-col"
    >
      <!-- Header -->
      <SheetHeader class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <SheetTitle>Member Details</SheetTitle>
          <SheetClose as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <X class="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <!-- Content - Scrollable -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="displayMember" class="space-y-6">
          <!-- Profile Card -->
          <MemberProfileCard :member="displayMember" />

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="handleEdit">
              <Pencil class="mr-2 h-4 w-4" />
              Edit Member
            </Button>
          </div>

          <Separator />

          <!-- Personal Information -->
          <MemberPersonalInfo :member="displayMember" />

          <!-- Location Information -->
          <MemberLocationInfo :member="displayMember" />

          <!-- Spiritual Information -->
          <MemberSpiritualInfo :member="displayMember" />

          <!-- Groups List -->
          <MemberGroupsList :member="displayMember" />
        </div>

        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Member Not Found</h3>
            <p class="text-muted-foreground">The member information could not be loaded.</p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
