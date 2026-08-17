import { computed, onBeforeUnmount, ref } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { debounce } from '@/utils/debounce'
import { groupsService } from '../services/groupsService'

const emptyPagination = () => ({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

export function useGroupsIndex() {
  const authStore = useAuthStore()
  const activeTab = ref('my')
  const groups = ref([])
  const loading = ref(false)
  const search = ref('')
  const filters = ref({
    category_id: 'all',
    template: 'all',
    is_active: 'all',
    archived: 'without',
  })
  const pagination = ref(emptyPagination())

  const canViewAll = computed(() => authStore.can('groups.view_all'))
  const canCreate = computed(() => authStore.can('groups.create'))
  const canUpdate = computed(() => authStore.can('groups.update'))
  const canArchive = computed(() => authStore.can('groups.archive'))

  function queryParams() {
    return {
      page: pagination.value.current_page,
      perPage: pagination.value.per_page,
      search: search.value.trim() || undefined,
      category_id:
        filters.value.category_id === 'all' ? undefined : filters.value.category_id,
      template: filters.value.template === 'all' ? undefined : filters.value.template,
      is_active: filters.value.is_active === 'all' ? undefined : filters.value.is_active,
      archived: filters.value.archived,
    }
  }

  async function load() {
    loading.value = true

    try {
      const request =
        activeTab.value === 'church' && canViewAll.value
          ? groupsService.churchGroups
          : groupsService.myGroups
      const response = await request(queryParams())
      const data = response.data.data

      groups.value = data.groups ?? []
      pagination.value = { ...emptyPagination(), ...(data.meta ?? {}) }
    } finally {
      loading.value = false
    }
  }

  const searchLater = debounce(() => {
    pagination.value.current_page = 1
    load()
  }, 350)

  function setSearch(value) {
    search.value = value
    searchLater()
  }

  function setFilter(key, value) {
    filters.value[key] = value
    pagination.value.current_page = 1
    load()
  }

  function setTab(tab) {
    activeTab.value = tab
    pagination.value.current_page = 1
    load()
  }

  function setPage(page) {
    pagination.value.current_page = page
    load()
  }

  function setPerPage(perPage) {
    pagination.value.per_page = perPage
    pagination.value.current_page = 1
    load()
  }

  onBeforeUnmount(() => searchLater.cancel())

  return {
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
  }
}
