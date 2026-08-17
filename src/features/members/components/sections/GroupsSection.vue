<script setup>
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Check } from 'lucide-vue-next'

/**
 * GroupsSection Component
 * Handles group selection fields for member form
 * 
 * @props {Object} formData - Form data object
 * @props {Object} errors - Validation errors object
 * @props {Array} groups - List of available groups
 * @emits {Event} update:formData - Emitted when form data changes
 */

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  groups: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:formData'])

// Group search state
const groupSearch = ref('')
const isGroupsPopoverOpen = ref(false)

/**
 * Filtered groups based on search
 */
const filteredGroups = computed(() => {
  if (!groupSearch.value) return props.groups
  return props.groups.filter((g) =>
    g.name?.toLowerCase().includes(groupSearch.value.toLowerCase())
  )
})

/**
 * Check whether a group ID is selected.
 * @returns {boolean} Whether group is selected
 */
function isGroupSelected(group) {
  return selectedGroupIds.value.includes(Number(group.id))
}

const selectedGroupIds = computed(() =>
  (props.formData.groups ?? []).map((groupId) => Number(groupId)).filter(Number.isInteger),
)

const selectedGroups = computed(() =>
  props.groups.filter((group) => selectedGroupIds.value.includes(Number(group.id))),
)

/**
 * Toggle group selection
 * @param {Object} group - Group to toggle
 */
function toggleGroup(group) {
  const groupId = Number(group.id)
  const currentGroups = selectedGroupIds.value
  const isSelected = currentGroups.includes(groupId)

  let newGroups
  if (isSelected) {
    newGroups = currentGroups.filter((id) => id !== groupId)
  } else {
    newGroups = [...currentGroups, groupId]
  }
  
  emit('update:formData', { ...props.formData, groups: newGroups })
}

/**
 * Remove a group from selection
 * @param {Object} group - Group to remove
 */
function removeGroup(groupId) {
  const newGroups = selectedGroupIds.value.filter((id) => id !== Number(groupId))
  emit('update:formData', { ...props.formData, groups: newGroups })
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Groups</label>
    
    <!-- Selected Groups Display -->
    <div v-if="selectedGroups.length > 0" class="mb-2 flex flex-wrap gap-2">
      <Badge
        v-for="group in selectedGroups"
        :key="group.id"
        variant="secondary"
        class="gap-1"
      >
        {{ group.name }}
        <button
          type="button"
          class="ml-1 hover:text-destructive"
          @click.stop="removeGroup(group.id)"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>
    </div>
    
    <!-- Groups Selector -->
    <Popover v-model:open="isGroupsPopoverOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-start"
          :class="!selectedGroupIds.length && 'text-muted-foreground'"
        >
          {{ selectedGroupIds.length ? `${selectedGroupIds.length} group(s) selected` : 'Select groups' }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[300px] p-0">
        <div class="p-2">
          <Input
            :model-value="groupSearch"
            placeholder="Search groups..."
            class="h-9"
            @update:model-value="(value) => groupSearch = value"
          />
        </div>
        <div class="max-h-[200px] overflow-y-auto">
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent flex items-center justify-between"
            @click="toggleGroup(group)"
          >
            <span>{{ group.name }}</span>
            <Check v-if="isGroupSelected(group)" class="h-4 w-4" />
          </div>
          <div v-if="filteredGroups.length === 0" class="px-2 py-4 text-center text-sm text-muted-foreground">
            No groups found
          </div>
        </div>
      </PopoverContent>
    </Popover>
    
    <p v-if="errors.groups" class="text-xs text-destructive">
      {{ errors.groups }}
    </p>
    <p class="text-xs text-muted-foreground">Select groups the member belongs to</p>
  </div>
</template>
