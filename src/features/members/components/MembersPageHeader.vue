<script setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserPlus, Upload, Download, ChevronDown } from 'lucide-vue-next'

/**
 * MembersPageHeader Component
 * Displays page header with action buttons for members page
 * 
 * @props {Boolean} canCreate - Whether user can create members
 * @props {Boolean} canImport - Whether user can import members
 * @props {Boolean} canExport - Whether user can export members
 * @emits {Event} create - Emitted when create button is clicked
 * @emits {Event} import - Emitted when import option is selected
 * @emits {Event} export - Emitted when export option is selected
 */

defineProps({
  canCreate: {
    type: Boolean,
    default: false,
  },
  canImport: {
    type: Boolean,
    default: false,
  },
  canExport: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['create', 'import', 'export'])
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Members</h1>
      <p class="text-muted-foreground mt-1">
        Manage church members and their information
      </p>
    </div>
    <div class="flex items-center gap-2">
      <!-- Import/Export Dropdown -->
      <DropdownMenu v-if="canImport || canExport">
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            <ChevronDown class="h-4 w-4 mr-2" />
            Import/Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            v-if="canImport"
            @click="emit('import')"
          >
            <Upload class="h-4 w-4 mr-2" />
            Import Members
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="canExport"
            @click="emit('export')"
          >
            <Download class="h-4 w-4 mr-2" />
            Export Members
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Create Member Button -->
      <Button v-if="canCreate" @click="emit('create')">
        <UserPlus class="mr-2 h-4 w-4" />
        Add New Member
      </Button>
    </div>
  </div>
</template>
