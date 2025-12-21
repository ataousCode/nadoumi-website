import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../../api/auth.js'

/**
 * Admin auth hook: tracks auth state and exposes login/logout.
 * Uses MongoDB backend API via src/api/auth.js.
 */
export default function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Start as loading
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const current = authApi.getCurrentUser?.()
    if (current) {
      setUser(current)
      setLoading(false)
    }
    
    // Verify token with backend
    authApi.verifyToken()
      .then((user) => {
        setUser(user || null)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const { user: u } = await authApi.login(email, password)
      setUser(u || null)
      return u
    } catch (err) {
      const message = err?.message || 'Login failed'
      const friendly = message.includes('Invalid') || message.includes('password')
        ? 'Invalid email or password.'
        : message.includes('Network') || message.includes('fetch')
        ? 'Network error. Please check your connection.'
        : message
      setError(friendly)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await authApi.logout()
      setUser(null)
    } catch (err) {
      setError(err?.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const isAuthenticated = useMemo(() => Boolean(user), [user])

  return { user, isAuthenticated, loading, error, login, logout }
}