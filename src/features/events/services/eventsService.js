import api from '@/services/api'
import generalHelpers from '@/utils/generalHelpers'

export function eventFormData(payload, update = false) {
  const formData = generalHelpers.jsonToFormData(payload)
  if (update) formData.append('_method', 'PUT')
  return formData
}

export const eventsService = {
  list: (params = {}) => api.get('/events', { params }),
  formOptions: () => api.get('/events/form-options'),
  show: (uuid) => api.get(`/events/${uuid}`),
  create: (payload) => api.post('/events', eventFormData(payload)),
  update: (uuid, payload) => api.post(`/events/${uuid}`, eventFormData(payload, true)),
  remove: (uuid) => api.delete(`/events/${uuid}`),
}

export function groupEventsService(groupUuid) {
  const path = `/groups/${groupUuid}/events`

  return {
    list: (params = {}) => api.get(path, { params }),
    formOptions: eventsService.formOptions,
    show: (uuid) => api.get(`${path}/${uuid}`),
    create: (payload) => api.post(path, eventFormData(payload)),
    update: (uuid, payload) => api.post(`${path}/${uuid}`, eventFormData(payload, true)),
    remove: (uuid) => api.delete(`${path}/${uuid}`),
  }
}
