import api from '@/services/api'

function basePath(system) {
  return system ? '/admin/audit-logs' : '/audit-logs'
}

export const auditService = {
  async list(params = {}, system = false) {
    const response = await api.get(basePath(system), { params })
    return response.data
  },

  async summary(params = {}, system = false) {
    const response = await api.get(`${basePath(system)}/summary`, { params })
    return response.data
  },

  async show(uuid, system = false) {
    const response = await api.get(`${basePath(system)}/${uuid}`)
    return response.data
  },

  async exportLogs(filters = {}, system = false) {
    const response = await api.post(`${basePath(system)}/export`, filters)
    return response.data
  },
}
