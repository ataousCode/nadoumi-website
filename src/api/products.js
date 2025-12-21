// MongoDB-backed products API
import { apiRequest, apiRequestFormData } from './config.js'

const API_BASE = '/products'

/**
 * Get all products
 * @param {boolean} enabledOnly - Only return enabled products
 */
export async function getProducts(enabledOnly = false) {
  const query = enabledOnly ? '?enabled=true' : ''
  return apiRequest(`${API_BASE}${query}`)
}

/**
 * Get a single product by ID
 */
export async function getProduct(id) {
  return apiRequest(`${API_BASE}/${id}`)
}

/**
 * Subscribe to products (polling-based for MongoDB)
 * @param {Function} onChange - Callback with list of products
 * @returns {Function} Unsubscribe function
 */
export function subscribeToProducts(onChange) {
  let intervalId = setInterval(async () => {
    try {
      const products = await getProducts()
      onChange(products)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, 5000) // Poll every 5 seconds

  // Initial fetch
  getProducts().then(onChange).catch(console.error)

  return () => clearInterval(intervalId)
}

/**
 * Subscribe to enabled products (polling-based)
 */
export function subscribeToEnabledProducts(onChange) {
  let intervalId = setInterval(async () => {
    try {
      const products = await getProducts(true)
      onChange(products)
    } catch (error) {
      console.error('Error fetching enabled products:', error)
    }
  }, 5000)

  getProducts(true).then(onChange).catch(console.error)

  return () => clearInterval(intervalId)
}

/**
 * Get all enabled products
 */
export async function getEnabledProducts() {
  return getProducts(true)
}

/**
 * Upload product image
 */
export async function uploadProductImage(file, path) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  
  const response = await apiRequestFormData('/documents/upload', formData)
  return response.url
}

/**
 * Create a new product
 */
export async function createProduct(data, thumbnailFile, carouselFiles = []) {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }
  
  if (carouselFiles.length > 0) {
    carouselFiles.forEach(file => {
      formData.append('carousel', file)
    })
  }

  return apiRequestFormData(API_BASE, formData, { method: 'POST' })
}

/**
 * Update an existing product
 */
export async function updateProduct(id, data, thumbnailFile, carouselFiles = []) {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }
  
  if (carouselFiles.length > 0) {
    carouselFiles.forEach(file => {
      formData.append('carousel', file)
    })
  }

  return apiRequestFormData(`${API_BASE}/${id}`, formData, { method: 'PUT' })
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  await apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' })
  return id
}

/**
 * Toggle product enabled status
 */
export async function toggleProductStatus(id, enabled) {
  return apiRequest(`${API_BASE}/${id}/toggle`, { method: 'PATCH' })
}
