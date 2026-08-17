import api from '@/services/api'
import generalHelpers from '@/utils/generalHelpers'

const path = (type, uuid = '') => `/admin/geography/${type}${uuid ? `/${uuid}` : ''}`

export const geographyService = {
  list: (type, params = {}) => api.get(path(type), { params }),
  show: (type, uuid) => api.get(path(type, uuid)),
  create: (type, payload) => api.post(path(type), generalHelpers.jsonToFormData(payload)),
  update: (type, uuid, payload) => api.post(
    path(type, uuid),
    generalHelpers.jsonToFormData({ ...payload, _method: 'PUT' }),
  ),
  archive: (type, uuid) => api.delete(path(type, uuid)),
  restore: (type, uuid) => api.post(`${path(type, uuid)}/restore`),
}
