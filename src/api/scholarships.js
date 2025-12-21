import { apiRequest } from './config.js'

const API_BASE = '/scholarships'

export async function getScholarships(filters = {}) {
  const params = new URLSearchParams()
  
  if (filters.category) params.append('category', filters.category)
  if (filters.country) params.append('country', filters.country)
  if (filters.search) params.append('search', filters.search)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  if (filters.status) params.append('status', filters.status)

  const query = params.toString()
  return apiRequest(`${API_BASE}${query ? `?${query}` : ''}`)
}

export async function getFeaturedScholarships() {
  return apiRequest(`${API_BASE}/featured`)
}

export async function getScholarship(id) {
  return apiRequest(`${API_BASE}/${id}`)
}

export async function createScholarship(data) {
  return apiRequest(API_BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateScholarship(id, data) {
  return apiRequest(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteScholarship(id) {
  await apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' })
  return id
}

export async function updateScholarshipStatus(id, status) {
  return apiRequest(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

