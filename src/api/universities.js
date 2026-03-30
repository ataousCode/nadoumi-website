import { apiRequest } from './config.js'

const API_BASE = 'universities'

export async function getUniversities(params = {}) {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })
  const queryString = queryParams.toString()
  return apiRequest(`${API_BASE}${queryString ? `?${queryString}` : ''}`)
}

export async function getUniversity(id) {
  return apiRequest(`${API_BASE}/${id}`)
}

export async function createUniversity(data) {
  return apiRequest(API_BASE, {
    method: 'POST',
    body: data,
  })
}

export async function updateUniversity(id, data) {
  return apiRequest(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteUniversity(id) {
  return apiRequest(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
}

export async function updateUniversityStatus(id, status) {
  return apiRequest(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

