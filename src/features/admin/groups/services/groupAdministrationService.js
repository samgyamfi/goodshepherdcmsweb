import api from '@/services/api'
import generalHelpers from '@/utils/generalHelpers'

function templateFormData(payload, update = false) {
  const formData = generalHelpers.jsonToFormData(payload)
  if (update) formData.append('_method', 'PUT')
  return formData
}

export const groupAdministrationService = {
  templates: (params = {}) => api.get('/admin/group-templates', { params }),
  options: (params = {}) => api.get('/admin/group-management/options', { params }),
  createTemplate: (payload) => api.post('/admin/group-templates', templateFormData(payload)),
  updateTemplate: (uuid, payload) => api.post(`/admin/group-templates/${uuid}`, templateFormData(payload, true)),
  deleteTemplate: (uuid) => api.delete(`/admin/group-templates/${uuid}`),
  officers: (districtId) => api.get(`/admin/districts/${districtId}/officers`),
  assignOfficer: (payload) => api.post('/admin/district-officers', payload),
  removeOfficer: (uuid) => api.delete(`/admin/district-officers/${uuid}`),
}
