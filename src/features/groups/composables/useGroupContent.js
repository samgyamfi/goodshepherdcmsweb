import { ref } from 'vue'
import { groupsService } from '../services/groupsService'

export function useGroupContent(groupUuid, type) {
  const items = ref([])
  const loading = ref(false)
  const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })

  async function load(page = meta.value.current_page, perPage = meta.value.per_page) {
    loading.value = true
    try {
      const response = await groupsService.content(groupUuid, type, { page, perPage })
      items.value = response.data.data[type] ?? []
      meta.value = response.data.data.meta
    } finally {
      loading.value = false
    }
  }

  async function save(payload, uuid = null) {
    if (uuid) {
      await groupsService.updateContent(groupUuid, type, uuid, payload)
    } else {
      await groupsService.createContent(groupUuid, type, payload)
    }
    await load()
  }

  async function remove(uuid) {
    await groupsService.deleteContent(groupUuid, type, uuid)
    await load()
  }

  return { items, loading, meta, load, save, remove }
}
