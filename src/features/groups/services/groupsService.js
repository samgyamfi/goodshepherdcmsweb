import api from '@/services/api'

const groupPath = (uuid, suffix = '') => `/groups/${uuid}${suffix}`

export const groupsService = {
  myGroups: (params = {}) => api.get('/groups/my', { params }),
  churchGroups: (params = {}) => api.get('/groups', { params }),
  formOptions: (params = {}) => api.get('/groups/form-options', { params }),
  get: (uuid) => api.get(groupPath(uuid)),
  wall: (uuid) => api.get(groupPath(uuid, '/wall')),
  dashboard: (uuid) => api.get(groupPath(uuid, '/dashboard')),
  personal: (uuid) => api.get(groupPath(uuid, '/personal')),
  create: (payload) => api.post('/groups', payload),
  update: (uuid, payload) =>
    payload instanceof FormData
      ? api.post(groupPath(uuid), payload)
      : api.put(groupPath(uuid), payload),
  archive: (uuid) => api.patch(groupPath(uuid, '/archive')),
  restore: (uuid) => api.patch(groupPath(uuid, '/restore')),

  members: (uuid, params = {}) => api.get(groupPath(uuid, '/members'), { params }),
  addMembers: (uuid, members) => api.post(groupPath(uuid, '/members'), { members }),
  updateMember: (uuid, membershipUuid, payload) =>
    api.patch(groupPath(uuid, `/members/${membershipUuid}`), payload),
  removeMember: (uuid, membershipUuid) =>
    api.delete(groupPath(uuid, `/members/${membershipUuid}`)),

  content: (uuid, type, params = {}) => api.get(groupPath(uuid, `/${type}`), { params }),
  createContent: (uuid, type, payload) => api.post(groupPath(uuid, `/${type}`), payload),
  updateContent: (uuid, type, contentUuid, payload) =>
    api.put(groupPath(uuid, `/${type}/${contentUuid}`), payload),
  deleteContent: (uuid, type, contentUuid) =>
    api.delete(groupPath(uuid, `/${type}/${contentUuid}`)),
}
