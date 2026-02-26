import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Maps a raw error message to a user-friendly string.
 * Checks against a list of [keywords, friendlyMessage] pairs in order.
 */
export function mapFriendlyError(message = '', extraChecks = []) {
  const checks = [
    ...extraChecks,
    [['Invalid', 'password'],          'Invalid email or password.'],
    [['verify'],                        'Please verify your email before logging in.'],
    [['already'],                       'This email or passport number is already registered.'],
    [['expired'],                       'Invalid or expired verification code.'],
    [['Network', 'fetch'],             'Network error. Please check your connection.'],
  ]
  for (const [keywords, friendly] of checks) {
    if (keywords.some((kw) => message.includes(kw))) return friendly
  }
  return message
}

/**
 * Factory that creates a session hook handling the shared auth state:
 * - user / loading / error state
 * - session verification on mount
 * - isAuthenticated derived value
 *
 * Returns { user, setUser, loading, setLoading, error, setError, isAuthenticated }
 * so each specific auth hook can build its own actions on top.
 *
 * @param {{ getCurrentUser: Function, verifyUser: Function }} config
 */
export function createAuthHook({ getCurrentUser, verifyUser }) {
  return function useAuthSession() {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState('')

    useEffect(() => {
      setLoading(true)
      const current = getCurrentUser?.()
      if (current) setUser(current)

      verifyUser()
        .then((data) => setUser(data || null))
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }, [])

    const isAuthenticated = useMemo(() => Boolean(user), [user])

    return { user, setUser, loading, setLoading, error, setError, isAuthenticated }
  }
}
