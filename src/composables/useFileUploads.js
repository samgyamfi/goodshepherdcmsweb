import api from '@/services/api'

export function useFileUploads() {
  const metadata = (uuid) => api.get(`/file-uploads/${uuid}`)
  const remove = (uuid) => api.delete(`/file-uploads/${uuid}`)

  function preview(file) {
    window.open(file.preview_url, '_blank', 'noopener,noreferrer')
  }

  function download(file) {
    window.open(file.download_url, '_blank', 'noopener,noreferrer')
  }

  return { metadata, preview, download, remove }
}
