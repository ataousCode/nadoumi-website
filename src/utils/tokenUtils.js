/**
 * Token Utilities
 * Helper functions for JWT token handling in the frontend
 */

/**
 * Decode JWT token payload (without verification)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export function decodeToken(token) {
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @param {string} expectedType - Expected user type ('admin' or 'student')
 * @returns {object|null} User info or null if invalid
 */
export function getUserFromToken(token, expectedType = null) {
  const payload = decodeToken(token)
  if (!payload) return null
  
  // Check if token type matches expected type
  if (expectedType && payload.type !== expectedType) {
    return null
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    return null
  }
  
  return {
    id: payload.id,
    email: payload.email,
    type: payload.type,
    exp: payload.exp,
    iat: payload.iat
  }
}

/**
 * Get token expiration date
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
export function getTokenExpiration(token) {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return null
  
  return new Date(payload.exp * 1000)
}

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number|null} Milliseconds until expiration or null
 */
export function getTimeUntilExpiration(token) {
  const expDate = getTokenExpiration(token)
  if (!expDate) return null
  
  return expDate.getTime() - Date.now()
}

/**
 * Check if token will expire soon
 * @param {string} token - JWT token
 * @param {number} minutesThreshold - Minutes before expiration to consider "soon" (default: 5)
 * @returns {boolean} True if token expires soon
 */
export function willExpireSoon(token, minutesThreshold = 5) {
  const timeUntilExpiration = getTimeUntilExpiration(token)
  if (timeUntilExpiration === null) return true
  
  const thresholdMs = minutesThreshold * 60 * 1000
  return timeUntilExpiration < thresholdMs
}

/**
 * Validate token format (basic check)
 * @param {string} token - JWT token
 * @returns {boolean} True if token format is valid
 */
export function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') return false
  
  const parts = token.split('.')
  if (parts.length !== 3) return false
  
  // Check if each part is base64 encoded
  try {
    atob(parts[0])
    atob(parts[1])
    return true
  } catch {
    return false
  }
}

