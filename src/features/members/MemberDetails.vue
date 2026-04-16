<script setup>
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
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
    <SheetContent side="right" class="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[1100px] 2xl:w-[1300px] p-0 flex flex-col">
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
        <div v-if="member" class="space-y-6">
          <!-- Profile Card -->
          <MemberProfileCard :member="member" />

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="handleEdit">
              <Pencil class="mr-2 h-4 w-4" />
              Edit Member
            </Button>
          </div>

          <Separator />

          <!-- Personal Information -->
          <MemberPersonalInfo :member="member" />

          <!-- Location Information -->
          <MemberLocationInfo :member="member" />

          <!-- Spiritual Information -->
          <MemberSpiritualInfo :member="member" />

          <!-- Groups List -->
          <MemberGroupsList :member="member" />
        </div>

        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold">Member Not Found</h3>
            <p class="text-muted-foreground">
              The member information could not be loaded.
            </p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
