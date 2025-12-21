export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nadoumibackend.onrender.com/api'

// Get the base server URL (without /api) for static files
export const getServerBaseURL = () => {
  const apiUrl = API_BASE_URL
  // Remove /api from the end if present
  if (apiUrl.endsWith('/api')) {
    return apiUrl.slice(0, -4)
  }
  return apiUrl.replace(/\/api$/, '')
}

// Helper to construct image URLs for uploaded files
export const getImageURL = (imagePath) => {
  if (!imagePath) return ''
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // If it starts with /uploads, use server base URL
  if (imagePath.startsWith('/uploads')) {
    return `${getServerBaseURL()}${imagePath}`
  }
  // Otherwise, assume it's relative to server base
  return `${getServerBaseURL()}/${imagePath}`
}

export const getAuthToken = (type = null) => {
  if (type === 'student') {
    return localStorage.getItem('studentToken')
  }
  if (type === 'admin') {
    return localStorage.getItem('adminToken')
  }
  return localStorage.getItem('adminToken') || localStorage.getItem('studentToken')
}

export const setAuthToken = (token, type = 'admin') => {
  if (token) {
    if (type === 'student') {
      localStorage.setItem('studentToken', token)
      localStorage.removeItem('adminToken')
    } else {
      localStorage.setItem('adminToken', token)
      localStorage.removeItem('studentToken')
    }
  } else {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('studentToken')
  }
}

export const clearAuthTokens = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('studentToken')
}

export const apiRequest = async (endpoint, options = {}) => {
  const isStudentEndpoint = 
    (endpoint.startsWith('/students') && 
     (endpoint === '/students/me' || 
      endpoint.startsWith('/students/me/') ||
      endpoint.startsWith('/students/register') ||
      endpoint.startsWith('/students/login') ||
      endpoint.startsWith('/students/verify-email') ||
      endpoint.startsWith('/students/resend-otp') ||
      endpoint.startsWith('/students/forgot-password') ||
      endpoint.startsWith('/students/reset-password'))) ||
    (endpoint.startsWith('/applications/student/me'))
  const token = getAuthToken(isStudentEndpoint ? 'student' : 'admin')
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    // Log API request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', { method: config.method || 'GET', url, endpoint })
    }
    
    const response = await fetch(url, config)
    
    // Try to parse JSON response
    let data
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (parseError) {
      // If response is not JSON, create error object
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      data = {}
    }
    
    if (!response.ok) {
      const errorMessage = data.error?.message || data.error || data.message || `Request failed: ${response.status} ${response.statusText}`
      const error = new Error(errorMessage)
      if (data.error?.errors) {
        error.errors = data.error.errors
      }
      if (data.error?.code) {
        error.code = data.error.code
      }
      error.response = data
      error.status = response.status
      throw error
    }

    return data
  } catch (err) {
    // Handle network errors (CORS, connection refused, etc.)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      const networkError = new Error('Network error. Please check your connection and ensure the API server is running.')
      networkError.originalError = err
      networkError.isNetworkError = true
      throw networkError
    }
    // Re-throw other errors
    throw err
  }
}
export const apiRequestFormData = async (endpoint, formData, options = {}) => {
  const isStudentEndpoint = 
    endpoint.startsWith('/applications/student/me') ||
    endpoint.startsWith('/students/me/profile-picture')
  const token = getAuthToken(isStudentEndpoint ? 'student' : 'admin')
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    method: options.method || 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: formData,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
    // Try to get detailed error message
    const errorMessage = errorData.message || errorData.error?.message || errorData.error || errorData.message || 'Request failed'
    const error = new Error(errorMessage)
    error.response = errorData
    if (errorData.details) {
      error.details = errorData.details
    }
    throw error
  }

  return response.json()
}

