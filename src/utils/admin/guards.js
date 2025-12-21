import { getCurrentUser } from '../../api/auth.js'

export function isAdminAuthenticated() {
  try {
    const user = getCurrentUser()
    return Boolean(user)
  } catch (_) {
    return false
  }
}

export function ensureAdminAuthenticatedRedirect(navigate, fallbackPath = '/login') {
  const authed = isAdminAuthenticated()
  if (!authed && typeof navigate === 'function') {
    navigate(fallbackPath)
  }
  return authed
}

export function withAdminAuth(element, fallback = null) {
  return isAdminAuthenticated() ? element : fallback
}