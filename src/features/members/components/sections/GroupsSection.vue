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
 * Check if a group is selected
 * @param {Object} group - Group to check
 * @returns {boolean} Whether group is selected
 */
function isGroupSelected(group) {
  const groupId = group.id || group.uuid
  return props.formData.groups?.some((g) => (g.id || g.uuid) === groupId) || false
}

/**
 * Toggle group selection
 * @param {Object} group - Group to toggle
 */
function toggleGroup(group) {
  const currentGroups = props.formData.groups || []
  const groupId = group.id || group.uuid
  
  const isSelected = currentGroups.some((g) => (g.id || g.uuid) === groupId)
  
  let newGroups
  if (isSelected) {
    newGroups = currentGroups.filter((g) => (g.id || g.uuid) !== groupId)
  } else {
    newGroups = [...currentGroups, group]
  }
  
  emit('update:formData', { ...props.formData, groups: newGroups })
}

/**
 * Remove a group from selection
 * @param {Object} group - Group to remove
 */
function removeGroup(group) {
  const groupId = group.id || group.uuid
  const newGroups = (props.formData.groups || []).filter(
    (g) => (g.id || g.uuid) !== groupId
  )
  emit('update:formData', { ...props.formData, groups: newGroups })
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Groups</label>
    
    <!-- Selected Groups Display -->
    <div v-if="formData.groups && formData.groups.length > 0" class="flex flex-wrap gap-2 mb-2">
      <Badge
        v-for="group in formData.groups"
        :key="group.id || group.uuid"
        variant="secondary"
        class="gap-1"
      >
        {{ group.name }}
        <button
          type="button"
          class="ml-1 hover:text-destructive"
          @click.stop="removeGroup(group)"
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
          :class="!formData.groups?.length && 'text-muted-foreground'"
        >
          {{ formData.groups?.length ? `${formData.groups.length} group(s) selected` : 'Select groups' }}
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
            :key="group.id || group.uuid"
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
