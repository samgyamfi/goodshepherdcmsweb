import { onMounted, reactive, ref } from 'vue'
import { auditService } from '@/services/audit/auditService'
import { showToast } from '@/utils/toast'

export function useAuditLogs(system = false) {
  const logs = ref([])
  const stats = ref({})
  const recent = ref([])
  const loading = ref(false)
  const exporting = ref(false)
  const pagination = reactive({ currentPage: 1, lastPage: 1, perPage: 25, total: 0, from: 0, to: 0 })
  const filters = reactive({ search: '', church_uuid: '', category: '', method: '', outcome: '', support_only: false, date_from: '', date_to: '' })

  function params() {
    return Object.fromEntries(Object.entries({ ...filters, page: pagination.currentPage, perPage: pagination.perPage })
      .filter(([, value]) => value !== '' && value !== false && value !== null))
  }

  async function load() {
    loading.value = true
    try {
      const response = await auditService.list(params(), system)
      const collection = response.data.logs
      logs.value = collection.data || []
      Object.assign(pagination, {
        currentPage: collection.meta?.current_page || 1,
        lastPage: collection.meta?.last_page || 1,
        perPage: collection.meta?.per_page || pagination.perPage,
        total: collection.meta?.total || 0,
        from: collection.meta?.from || 0,
        to: collection.meta?.to || 0,
      })
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Could not load audit logs.')
    } finally {
      loading.value = false
    }
  }

  async function loadSummary() {
    try {
      const response = await auditService.summary(params(), system)
      stats.value = response.data.stats || {}
      recent.value = response.data.recent || []
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Could not load audit summary.')
    }
  }

  async function applyFilters(values = {}) {
    Object.assign(filters, values)
    pagination.currentPage = 1
    await Promise.all([load(), loadSummary()])
  }

  function clearFilters() {
    Object.assign(filters, { search: '', church_uuid: '', category: '', method: '', outcome: '', support_only: false, date_from: '', date_to: '' })
    applyFilters()
  }

  async function setPage(page) {
    pagination.currentPage = page
    await load()
  }

  async function setPerPage(perPage) {
    pagination.perPage = perPage
    pagination.currentPage = 1
    await load()
  }

  async function exportLogs() {
    exporting.value = true
    try {
      const response = await auditService.exportLogs(params(), system)
      showToast.success(response.message || 'Audit export queued. Check your email for the download link.')
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Could not queue the audit export.')
    } finally {
      exporting.value = false
    }
  }

  onMounted(() => Promise.all([load(), loadSummary()]))

  return { logs, stats, recent, loading, exporting, pagination, filters, load, loadSummary, applyFilters, clearFilters, setPage, setPerPage, exportLogs }
}
