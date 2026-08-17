<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, UsersRound } from 'lucide-vue-next'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import { Button } from '@/components/ui/button'
import { TabsRoot, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import GroupFilters from './components/index/GroupFilters.vue'
import MyGroupCard from './components/index/MyGroupCard.vue'
import ChurchGroupsTable from './components/index/ChurchGroupsTable.vue'
import GroupFormSheet from './components/index/GroupFormSheet.vue'
import { useGroupsIndex } from './composables/useGroupsIndex'
import { groupsService } from './services/groupsService'
import { showToast } from '@/utils/toast'
import { useConfirm } from '@/composables/useConfirm'

const router = useRouter()
const formOpen = ref(false)
const selectedGroup = ref(null)
const categories = ref([])
const { confirm } = useConfirm()
const {
  activeTab,
  groups,
  loading,
  search,
  filters,
  pagination,
  canViewAll,
  canCreate,
  canUpdate,
  canArchive,
  load,
  setSearch,
  setFilter,
  setTab,
  setPage,
  setPerPage,
} = useGroupsIndex()

function openGroup(group) {
  router.push({ name: 'group-wall', params: { uuid: group.uuid } })
}

function createGroup() {
  selectedGroup.value = null
  formOpen.value = true
}

function editGroup(group) {
  selectedGroup.value = group
  formOpen.value = true
}

async function archiveGroup(group) {
  const confirmed = await confirm({
    title: `Archive ${group.name}?`,
    description:
      'Members will retain read-only access to historical information, but group content and membership changes will be blocked until the group is restored.',
    confirmLabel: 'Archive group',
  })
  if (!confirmed) return

  await groupsService.archive(group.uuid)
  showToast.success('Group archived.')
  load()
}

async function restoreGroup(group) {
  await groupsService.restore(group.uuid)
  showToast.success('Group restored.')
  load()
}

async function loadOptions() {
  const response = await groupsService.formOptions()
  categories.value = response.data.data.categories ?? []
}

onMounted(() => {
  load()
  loadOptions()
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-5">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <div class="rounded-md bg-primary/10 p-2.5 text-primary">
            <UsersRound class="h-6 w-6" />
          </div>
          <div class="min-w-0">
            <h1 class="text-2xl font-bold">Groups</h1>
            <p class="text-sm text-muted-foreground">
              Your communities, ministries, fellowships, and church groups
            </p>
          </div>
        </div>
          <Button v-if="activeTab === 'church' && canCreate" @click="createGroup">
            <Plus class="mr-2 h-4 w-4" /> Create group
          </Button>
      </header>

      <TabsRoot :model-value="activeTab" @update:model-value="setTab">
        <TabsList class="w-full justify-start overflow-x-auto">
          <TabsTrigger value="my">My Groups</TabsTrigger>
          <TabsTrigger v-if="canViewAll" value="church">Church Groups</TabsTrigger>
        </TabsList>
      </TabsRoot>

      <GroupFilters
        :search="search"
        :filters="filters"
        :categories="categories"
        :show-archive="activeTab === 'church'"
        @search="setSearch"
        @filter="setFilter"
      />

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in 6" :key="item" class="h-80 animate-pulse rounded-md bg-muted" />
      </div>

      <template v-else>
        <div
          v-if="activeTab === 'my'"
          class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <MyGroupCard
            v-for="group in groups"
            :key="group.uuid"
            :group="group"
            @open="openGroup"
          />
          <div
            v-if="!groups.length"
            class="col-span-full rounded-md border border-dashed px-5 py-16 text-center"
          >
            <UsersRound class="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 class="mt-3 font-semibold">No group memberships yet</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Groups you join in this church will appear here.
            </p>
          </div>
        </div>

        <ChurchGroupsTable
          v-else
          :groups="groups"
          :can-update="canUpdate"
          :can-archive="canArchive"
          @open="openGroup"
          @edit="editGroup"
          @archive="archiveGroup"
          @restore="restoreGroup"
        />

        <div class="border-t pt-4">
          <TablePagination
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :per-page="pagination.per_page"
            :total="pagination.total"
            :from="pagination.from || 0"
            :to="pagination.to || 0"
            @page-change="setPage"
            @per-page-change="setPerPage"
          />
        </div>
      </template>
    </div>

    <GroupFormSheet
      v-model:open="formOpen"
      :group="selectedGroup"
      @saved="load"
    />
  </DashboardLayout>
</template>
