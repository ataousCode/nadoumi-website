// Student API client
import { apiRequest, setAuthToken, getAuthToken, API_BASE_URL } from './axiosInstance.js'
import { getUserFromToken } from '../utils/tokenUtils.js'

const API_BASE = 'students'

/**
 * Register new student
 * Returns: { student, message } - Note: No token until email is verified
 */
export async function registerStudent(data) {
  const response = await apiRequest(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  
  // Backend returns { success: true, data: { student, message } }
  return response.data || response
}

/**
 * Verify email with OTP
 * Returns: { token, student }
 */
export async function verifyEmail(email, otp) {
  const response = await apiRequest(`${API_BASE}/verify-email`, {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
  
  const data = response.data || response
  if (data.token) {
    setAuthToken(data.token, 'student')
  }
  return data
}

/**
 * Resend verification OTP
 */
export async function resendOTP(email) {
  const response = await apiRequest(`${API_BASE}/resend-otp`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  
  return response.data || response
}

/**
 * Student login
 * Returns: { token, student }
 */
export async function loginStudent(email, password) {
  const response = await apiRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  const data = response.data || response
  if (data.token) {
    setAuthToken(data.token, 'student')
  }
  return data
}

/**
 * Forgot password - request reset link
 */
export async function forgotPassword(email) {
  const response = await apiRequest(`${API_BASE}/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  
  return response.data || response
}

/**
 * Reset password with token
 */
export async function resetPassword(token, password) {
  const response = await apiRequest(`${API_BASE}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
  
  return response.data || response
}

/**
 * Get current student profile
 */
export async function getStudentProfile() {
  const response = await apiRequest(`${API_BASE}/me`)
  return response.data || response
}

/**
 * Update student profile
 */
export async function updateStudentProfile(data) {
  const response = await apiRequest(`${API_BASE}/me`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  
  return response.data || response
}

/**
 * Change password
 */
export async function changePassword(currentPassword, newPassword) {
  const response = await apiRequest(`${API_BASE}/me/password`, {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  
  return response.data || response
}

/**
 * Get current student (from token) - synchronous
 */
export function getCurrentStudent() {
  const token = getAuthToken('student')
  return getUserFromToken(token, 'student')
}

/**
 * Verify student token with backend
 */
export async function verifyStudentToken() {
  const token = getAuthToken('student')
  if (!token) return null
  
  try {
    const response = await getStudentProfile()
    return response
  } catch {
    setAuthToken(null, 'student')
    return null
  }
}

/**
 * Logout student — clears httpOnly cookie via backend + removes local token.
 */
export async function logoutStudent() {
  try {
    // Ask the backend to clear the httpOnly cookie
    await apiRequest(`${API_BASE}/logout`, { method: 'DELETE' })
  } catch {
    // Proceed with local cleanup regardless of server response
  } finally {
    setAuthToken(null, 'student')
  }
}

/**
 * Get all students (admin only)
 */
export async function getAllStudents() {
  const response = await apiRequest(`${API_BASE}`, { method: 'GET' })
  return response.data || response
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(file) {
  const formData = new FormData()
  formData.append('profilePicture', file)
  
  const token = getAuthToken('student')
  const url = `${API_BASE_URL}${API_BASE}/me/profile-picture`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(error.error || 'Failed to upload profile picture')
  }
  
  return response.json()
}

