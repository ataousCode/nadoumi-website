// Admin auth API
import { apiRequest, setAuthToken, getAuthToken } from './config.js'
import { getUserFromToken } from '../utils/tokenUtils.js'

const API_BASE = '/admin'

export function getCurrentUser() {
  const token = getAuthToken('admin')
  return getUserFromToken(token, 'admin')
}

export async function login(email, password) {
  const response = await apiRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  // Backend returns { success: true, data: { token, user/admin } }
  const data = response.data || response
  if (data.token) {
    setAuthToken(data.token, 'admin')
  }
  const adminUser = data.admin || data.user
  return { user: adminUser }
}

export async function logout() {
  try {
    // Ask the backend to clear the httpOnly cookie
    await apiRequest(`${API_BASE}/logout`, { method: 'DELETE' })
  } catch {
    // Proceed with local cleanup regardless of server response
  } finally {
    setAuthToken(null, 'admin')
  }
}

// Verify token on app load
export async function verifyToken() {
  const token = getAuthToken('admin')
  if (!token) return null
  
  try {
    const response = await apiRequest(`${API_BASE}/verify`)
    // Backend returns { success: true, data: { user/admin } }
    const adminUser = response.data?.admin || response.data?.user || response.admin || response.user
    return adminUser
  } catch {
    setAuthToken(null, 'admin')
    return null
  }
}
