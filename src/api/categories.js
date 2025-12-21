// MongoDB-backed categories API
import { apiRequest, apiRequestFormData } from './config.js'

const API_BASE = '/categories'

/**
 * Get all categories
 * @param {boolean} enabledOnly - Only return enabled categories
 */
export async function getCategories(enabledOnly = false) {
  const query = enabledOnly ? '?enabled=true' : ''
  return apiRequest(`${API_BASE}${query}`)
}

/**
 * Subscribe to categories (polling-based)
 */
export function subscribeToCategories(onChange) {
  let intervalId = setInterval(async () => {
    try {
      const categories = await getCategories()
      onChange(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, 5000)

  getCategories().then(onChange).catch(console.error)

  return () => clearInterval(intervalId)
}

/**
 * Get all active categories
 */
export async function getActiveCategories() {
  return getCategories(true)
}

/**
 * Upload category icon
 */
export async function uploadCategoryIcon(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await apiRequestFormData('/documents/upload', formData)
  return response.url
}

/**
 * Create a new category
 */
export async function createCategory(data, iconFile) {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  
  if (iconFile) {
    formData.append('icon', iconFile)
  }

  return apiRequestFormData(API_BASE, formData, { method: 'POST' })
}

/**
 * Update an existing category
 */
export async function updateCategory(id, data, iconFile) {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  
  if (iconFile) {
    formData.append('icon', iconFile)
  }

  return apiRequestFormData(`${API_BASE}/${id}`, formData, { method: 'PUT' })
}

/**
 * Delete a category
 */
export async function deleteCategory(id) {
  await apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' })
  return id
}

/**
 * Toggle category enabled status
 */
export async function toggleCategoryStatus(id, enabled) {
  return apiRequest(`${API_BASE}/${id}/toggle`, { method: 'PATCH' })
}
