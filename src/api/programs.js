import { apiRequest } from './axiosInstance.js'

const API_BASE = 'programs'

export async function getPrograms(params = {}) {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })
  const queryString = queryParams.toString()
  return apiRequest(`${API_BASE}${queryString ? `?${queryString}` : ''}`)
}

export async function getFeaturedPrograms() {
  return apiRequest(`${API_BASE}/featured`)
}

export async function getProgram(id) {
  return apiRequest(`${API_BASE}/${id}`)
}

export async function getProgramCategories() {
  return apiRequest(`${API_BASE}/categories`)
}
