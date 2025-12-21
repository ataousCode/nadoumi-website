// Admin auth API
import { apiRequest, setAuthToken, getAuthToken } from './config.js'

const API_BASE = '/admin'

export function getCurrentUser() {
  const token = getAuthToken('admin')
  if (!token) return null
  
  // Decode token to get user info (simple JWT decode without verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.type !== 'admin') return null
    return {
      uid: payload.id,
      email: payload.email
    }
  } catch {
    return null
  }
}

export async function login(email, password) {
  const response = await apiRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  // Backend returns { success: true, data: { token, user } }
  const data = response.data || response
  if (data.token) {
    setAuthToken(data.token, 'admin')
  }
  return { user: data.user }
}

export async function logout() {
  setAuthToken(null, 'admin')
}

// Verify token on app load
export async function verifyToken() {
  const token = getAuthToken('admin')
  if (!token) return null
  
  try {
    const response = await apiRequest(`${API_BASE}/verify`)
    // Backend returns { success: true, data: { user } }
    return response.data?.user || response.user
  } catch {
    setAuthToken(null, 'admin')
    return null
  }
}
